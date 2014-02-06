<?php namespace Mmanos\Blog;

class Post extends \Eloquent
{
	protected $table = 'blog_posts';
	protected $softDelete = true;
	protected $guarded = array('id');
	
	public function blog()
	{
		return $this->belongsTo('\Mmanos\Blog');
	}
	
	public function parent()
	{
		return $this->belongsTo('\Mmanos\Blog\Post');
	}
	
	public function children()
	{
		return $this->hasMany('\Mmanos\Blog\Post', 'parent_id');
	}
	
	public function setTitleAttribute($title)
	{
		// Strip out html tags.
		$title = strip_tags($title);
		
		// Convert &nbsp; and newlines to spaces.
		$title = str_ireplace(array("&nbsp;","\n","\r"), array(' ',' ',''), $title);
		
		// Truncate and trim.
		$title = \Illuminate\Support\Str::limit($title, 252, '...');
		
		$this->attributes['title'] = $title;
	}
	
	public function setContentAttribute($content)
	{
		// Convert \r\n and \r to \n.
		$content = str_replace("\r", "\n", str_replace("\r\n", "\n", $content));
		
		// Decode htmlspecialchars.
		$content = htmlspecialchars_decode($content);
		
		$this->attributes['content'] = $content;
	}
	
	public function incrementNumViews()
	{
		try {
			\Blog\Service\Post::increment_num_views($this);
		} catch (Exception $e) {}
		
		return $this;
	}
	
	public function render()
	{
		return \Michelf\Markdown::defaultTransform($this->content);
	}
	
	public function renderPreview()
	{
		$str_parts = explode('<!--more-->', $this->render());
		return current($str_parts);
	}
}
