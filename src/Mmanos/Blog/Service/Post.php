<?php namespace Mmanos\Blog\Service;

/**
 * The Blog Post service.
 */
class Post
{
	/**
	 * Create a new Post.
	 *
	 * @param \Mmanos\Blog $blog
	 * @param string       $content
	 * @param int|string   $creator_id
	 * @param array        $options
	 * 
	 * @return \Mmanos\Blog\Post
	 * @throws Exception
	 */
	public static function create(\Mmanos\Blog $blog, $content, $creator_id, array $options = array())
	{
		$post = new \Mmanos\Blog\Post(array(
			'blog_id'    => $blog->id,
			'content'    => $content,
			'creator_id' => $creator_id,
			'published'  => 1,
		));
		
		if (!empty($options['title'])) {
			$post->title = $options['title'];
		}
		else {
			$post->title = $content;
		}
		
		if (!empty($options['name'])) {
			$post->name = $options['name'];
		}
		else {
			$post->name = \Str::slug($post->title);
		}
		
		if (isset($options['published'])) {
			$post->published = (int) (bool) $options['published'];
		}
		
		if (!empty($options['user_ip'])) {
			$post->user_ip = $options['user_ip'];
		}
		
		if (!empty($options['parent']) && $options['parent'] instanceof \Mmanos\Blog\Post) {
			$post->parent_id = $options['parent']->id;
		}
		else if (!empty($options['parent_id'])) {
			$post->parent_id = $options['parent_id'];
		}
		
		$post->save();
		
		return $post;
	}
	
	/**
	 * Update a Post.
	 *
	 * @param \Mmanos\Blog\Post $post
	 * @param array             $options
	 * 
	 * @return void
	 * @throws Exception
	 */
	public static function update(\Mmanos\Blog\Post $post, array $options = array())
	{
		if (!empty($options['title'])) {
			$post->title = $options['title'];
		}
		
		if (!empty($options['name'])) {
			$post->name = $options['name'];
		}
		
		if (!empty($options['content'])) {
			$post->content = $options['content'];
		}
		
		if (isset($options['published'])) {
			$post->published = (int) (bool) $options['published'];
		}
		
		$post->save();
	}
	
	/**
	 * Delete a Post.
	 *
	 * @param \Mmanos\Blog\Post $post
	 * 
	 * @return void
	 * @throws Exception
	 */
	public static function delete(\Mmanos\Blog\Post $post)
	{
		// Delete all child posts.
		\Mmanos\Blog\Post::where('parent_id', '=', $post->id)->delete();
		
		$post->delete();
	}
	
	/**
	 * Increments num_views for a Post.
	 *
	 * @param \Mmanos\Blog\Post $post
	 * 
	 * @return void
	 * @throws Exception
	 */
	public static function incrementNumViews(\Mmanos\Blog\Post $post)
	{
		$post->increment('num_views');
	}
}
