<?php namespace Mmanos\Blog\Service;

/**
 * The Blog service.
 */
class Blog
{
	/**
	 * Create a new Blog.
	 *
	 * @param string     $title
	 * @param int|string $creator
	 * @param array      $options
	 * 
	 * @return \Mmanos\Blog
	 * @throws Exception
	 */
	public static function create($title, $creator_id, array $options = array())
	{
		$blog = new \Mmanos\Blog(array(
			'title'      => $title,
			'creator_id' => $creator_id,
		));
		
		if (!empty($options['description'])) {
			$blog->description = $options['description'];
		}
		
		$blog->save();
		
		return $blog;
	}
	
	/**
	 * Update a Blog.
	 *
	 * @param \Mmanos\Blog $blog
	 * @param array        $options
	 * 
	 * @return void
	 * @throws Exception
	 */
	public static function update(\Mmanos\Blog $blog, array $options = array())
	{
		if (!empty($options['title'])) {
			$blog->title = $options['title'];
		}
		
		if (!empty($options['description'])) {
			$blog->description = $options['description'];
		}
		
		$blog->save();
	}
	
	/**
	 * Delete a Blog.
	 *
	 * @param \Mmanos\Blog $blog
	 * 
	 * @return void
	 * @throws Exception
	 */
	public static function delete(\Mmanos\Blog $blog)
	{
		// Delete all posts in this blog.
		\Mmanos\Blog\Post::where('blog_id', '=', $blog->id)->delete();
		
		$blog->delete();
	}
}
