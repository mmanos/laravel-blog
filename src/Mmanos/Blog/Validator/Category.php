<?php namespace Mmanos\Blog\Validator;

/**
 * Blog Category validator(s).
 */
class Category
{
	/**
	 * Default messages for this class.
	 *
	 * @var array
	 */
	public static $messages = array(
		'name_available' => 'This name is already taken.',
	);
	
	/**
	 * Create Category validator.
	 *
	 * @return Validator
	 */
	public static function create(\Mmanos\Blog $blog, array $input, array $rules = array(), array $messages = array())
	{
		$rules = array_merge($rules, array(
			'title' => 'required|min:1',
			'name'  => 'name_available',
		));
		
		return \Validator::make($input, $rules, $messages);
	}
	
	/**
	 * Update Category validator.
	 *
	 * @return Validator
	 */
	public static function update(\Mmanos\Blog $blog, array $input, array $rules = array(), array $messages = array())
	{
		static::registerNameAvailable($blog, $post);
		
		$rules = array_merge($rules, array(
			'name' => 'name_available',
		));
		
		return \Validator::make($input, $rules, $messages);
	}
	
	/*************************************************************************/
	/* Custom Validation Rules                                               */
	/*************************************************************************/
	
	/**
	 * Register custom rule: name_available.
	 *
	 * @param \Mmanos\Blog          $blog
	 * @param \Mmanos\Blog\Category $category
	 * 
	 * @return void
	 */
	public static function registerNameAvailable(\Mmanos\Blog $blog, \Mmanos\Blog\Category $category = null)
	{
		\Validator::extend('name_available', function ($attribute, $value, $parameters) use ($blog, $category) {
			$existing = \Mmanos\Blog\Category::where('blog_id', '=', $blog->id)
				->where('name', '=', $value)
				->first();
			
			if (!$existing) {
				return true;
			}
			
			if ($category) {
				if ($category->id == $existing->id) {
					return true;
				}
			}
			
			return false;
		});
	}
}
