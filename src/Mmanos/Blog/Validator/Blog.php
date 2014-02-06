<?php namespace Mmanos\Blog\Validator;

/**
 * Blog validator(s).
 */
class Blog
{
	/**
	 * Create Blog validator.
	 *
	 * @return Validator
	 */
	public static function create(array $input, array $rules = array(), array $messages = array())
	{
		$rules = array_merge($rules, array(
			'title' => 'required|min:1',
		));
		
		return \Validator::make($input, $rules, $messages);
	}
	
	/**
	 * Update Blog validator.
	 *
	 * @return Validator
	 */
	public static function update(array $input, array $rules = array(), array $messages = array())
	{
		$rules = array_merge($rules, array());
		
		return \Validator::make($input, $rules, $messages);
	}
}
