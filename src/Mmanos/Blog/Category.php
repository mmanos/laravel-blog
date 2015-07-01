<?php namespace Mmanos\Blog;

class Category extends \Eloquent
{
	protected $table = 'blog_categories';
	protected $softDelete = true;
	protected $guarded = array('id');
	
	public function blog()
	{
		return $this->belongsTo('\Mmanos\Blog');
	}
	
	public function posts()
	{
		return Blog\Post::where('blog_id', $this->blog_id)
			->where('category_id', $this->id)
			->get();
	}
}
