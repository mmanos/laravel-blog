<?php namespace Mmanos\Blog\Validator;

/**
 * Blog Post validator(s).
 */
class Post
{
	/**
	 * Default messages for this class.
	 *
	 * @var array
	 */
	public static $messages = array(
		'name_available' => 'This name is already taken.',
		'valid_parent'   => 'Invalid parent post specified.',
	);
	
	/**
	 * Create Post validator.
	 *
	 * @return Validator
	 */
	public static function create(\Mmanos\Blog $blog, array $input, array $rules = array(), array $messages = array())
	{
		static::registerNameAvailable($blog);
		static::registerValidParent($blog);
		
		$rules = array_merge($rules, array(
			'title'     => 'required',
			'content'   => 'required',
			'name'      => 'name_available',
			'user_ip'   => 'ip',
			'published' => 'integer',
			'parent_id' => 'integer|valid_parent',
		));
		
		return \Validator::make($input, $rules, array_merge(self::$messages, $messages));
	}
	
	/**
	 * Update Post validator.
	 *
	 * @return Validator
	 */
	public static function update(\Mmanos\Blog $blog, \Mmanos\Blog\Post $post, array $input, array $rules = array(), array $messages = array())
	{
		static::registerNameAvailable($blog, $post);
		
		$rules = array_merge($rules, array(
			'name'      => 'name_available',
			'published' => 'integer',
		));
		
		return \Validator::make($input, $rules, array_merge(self::$messages, $messages));
	}
	
	/*************************************************************************/
	/* Custom Validation Rules                                               */
	/*************************************************************************/
	
	/**
	 * Register custom rule: name_available.
	 *
	 * @param \Mmanos\Blog      $blog
	 * @param \Mmanos\Blog\Post $post
	 * 
	 * @return void
	 */
	public static function registerNameAvailable(\Mmanos\Blog $blog, \Mmanos\Blog\Post $post = null)
	{
		\Validator::extend('name_available', function ($attribute, $value, $parameters) use ($blog, $post) {
			$existing = \Mmanos\Blog\Post::where('blog_id', '=', $blog->id)
				->where('name', '=', $value)
				->first();
			
			if (!$existing) {
				return true;
			}
			
			if ($post) {
				if ($post->id == $existing->id) {
					return true;
				}
			}
			
			return false;
		});
	}
	
	/**
	 * Register custom rule: valid_parent.
	 *
	 * @param \Mmanos\Blog $blog
	 * 
	 * @return void
	 */
	public static function registerValidParent(\Mmanos\Blog $blog)
	{
		\Validator::extend('valid_parent', function ($attribute, $value, $parameters) use ($blog) {
			$post = \Mmanos\Blog\Post::find($value);
			if (!$post) {
				return false;
			}
			
			if ($post->blog_id != $blog->id) {
				return false;
			}
			
			return true;
		});
	}
}
