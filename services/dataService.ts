import { supabase } from '../supabaseClient';
import { Post } from '../types';

export const PostService = {
    /**
     * Fetch all posts from Supabase, ordered by creation time descending.
     * Checks if current user liked or bookmarked them.
     */
    async getPosts(currentUserId?: string): Promise<(Post & { isLiked: boolean; isBookmarked: boolean })[]> {
        let query = supabase
            .from('posts')
            .select(`
        *,
        post_likes ( user_id ),
        bookmarks ( user_id )
      `)
            .order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching posts:', error);
            return [];
        }

        return this.mapSupabaseDataToPosts(data as any[], currentUserId);
    },

    /**
     * Create a new post in Supabase
     */
    async createPost(post: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'views'>, userId?: string): Promise<Post | null> {
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title: post.title,
                    content: post.content,
                    category: post.category,
                    author: post.author.name,
                    role: post.author.role,
                    tags: [post.tag],
                    likes: 0,
                    user_id: userId
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating post:', error);
            return null;
        }

        return {
            id: data.id.toString(),
            title: data.title,
            content: data.content,
            category: data.category,
            author: {
                id: userId || 'anon',
                name: data.author,
                role: data.role as any,
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (userId || data.author)
            },
            timestamp: new Date(data.created_at).toLocaleDateString(),
            likes: data.likes,
            comments: [],
            tag: data.tags?.[0],
            views: 0
        };
    },

    async toggleLike(postId: string, userId: string): Promise<boolean> {
        // 1. Check if liked
        const { data } = await supabase.from('post_likes').select('id').eq('post_id', postId).eq('user_id', userId).single();

        if (data) {
            // Unlike
            await supabase.from('post_likes').delete().eq('id', data.id);
            // Decrement count
            await supabase.rpc('decrement_likes', { row_id: postId }); // Need RPC or simple update
            // Simple update for now (race condition possible but ok for demo)
            const { data: post } = await supabase.from('posts').select('likes').eq('id', postId).single();
            await supabase.from('posts').update({ likes: Math.max(0, (post?.likes || 0) - 1) }).eq('id', postId);
            return false;
        } else {
            // Like
            await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
            // Increment count
            const { data: post } = await supabase.from('posts').select('likes').eq('id', postId).single();
            await supabase.from('posts').update({ likes: (post?.likes || 0) + 1 }).eq('id', postId);
            return true;
        }
    },

    async toggleBookmark(postId: string, userId: string): Promise<boolean> {
        const { data } = await supabase.from('bookmarks').select('id').eq('post_id', postId).eq('user_id', userId).single();
        if (data) {
            await supabase.from('bookmarks').delete().eq('id', data.id);
            return false;
        } else {
            await supabase.from('bookmarks').insert({ post_id: postId, user_id: userId });
            return true;
        }
    },

    /**
     * Fetch posts created by a specific user
     */
    async getUserPosts(userId: string): Promise<(Post & { isLiked: boolean; isBookmarked: boolean })[]> {
        const { data, error } = await supabase
            .from('posts')
            .select(`
        *,
        post_likes ( user_id ),
        bookmarks ( user_id )
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user posts:', error);
            return [];
        }

        return this.mapSupabaseDataToPosts(data, userId);
    },

    /**
     * Fetch posts liked by a specific user
     */
    async getLikedPosts(userId: string): Promise<(Post & { isLiked: boolean; isBookmarked: boolean })[]> {
        // Supabase can't directly join via junction table easily in one simple query without foreign key hints sometimes
        // But since we have RLS policies, let's try a direct approach:
        // Select post_likes where user_id matches, then select associated posts.

        const { data, error } = await supabase
            .from('post_likes')
            .select(`
        post_id,
        posts:post_id (
          *,
          post_likes ( user_id ),
          bookmarks ( user_id )
        )
      `)
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching liked posts:', error);
            return [];
        }

        // Extract posts from the nested structure
        const posts = data.map((item: any) => item.posts).filter(p => p !== null);

        return this.mapSupabaseDataToPosts(posts, userId);
    },

    /**
     * Fetch posts bookmarked by a specific user
     */
    async getBookmarkedPosts(userId: string): Promise<(Post & { isLiked: boolean; isBookmarked: boolean })[]> {
        const { data, error } = await supabase
            .from('bookmarks')
            .select(`
        post_id,
        posts:post_id (
          *,
          post_likes ( user_id ),
          bookmarks ( user_id )
        )
      `)
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching bookmarked posts:', error);
            return [];
        }

        const posts = data.map((item: any) => item.posts).filter(p => p !== null);

        return this.mapSupabaseDataToPosts(posts, userId);
    },

    // Helper to DRY up the mapping logic
    mapSupabaseDataToPosts(data: any[], currentUserId?: string) {
        return data.map(item => {
            const isLiked = currentUserId ? item.post_likes?.some((l: any) => l.user_id === currentUserId) : false;
            const isBookmarked = currentUserId ? item.bookmarks?.some((b: any) => b.user_id === currentUserId) : false;

            return {
                id: item.id.toString(),
                title: item.title,
                content: item.content,
                category: item.category,
                author: {
                    id: item.user_id || 'anon',
                    name: item.author,
                    role: item.role as any,
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (item.user_id || item.author)
                },
                timestamp: new Date(item.created_at).toLocaleDateString(),
                likes: Number(item.likes),
                comments: [],
                tag: item.tags?.[0] || '一般交流',
                views: 0,
                isLiked,
                isBookmarked
            };
        });
    }
};
