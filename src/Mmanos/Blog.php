<?php namespace Mmanos;

class Blog extends \Eloquent
{
	protected $softDelete = true;
	protected $guarded = array('id');
	
	public function posts()
	{
		return $this->hasMany('\Mmanos\Blog\Post');
	}
	
	public function numPosts()
	{
		return Blog\Post::where('blog_id', '=', $this->id)->count();
	}
}
