<?php

/**
 * Admin Blog Posts controller.
 * 
 * @author Mark Manos
 */
class AdminpostsController extends BaseController
{
	/**
	 * Instantiate a new controller instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		// Check for admin.
		$fn = \Config::get('laravel-blog::is_admin');
		if (!$fn || !$fn()) {
			App::abort(404);
		}
	}
	
	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index($blog_id)
	{
		$blog = Mmanos\Blog::find($blog_id);
		if (!$blog) {
			App::abort(404);
		}
		
		return Mmanos\Blog\Post::where('blog_id', '=', $blog->id)
			->take(Input::get('num', 20))
			->skip((Input::get('page', 1) - 1) * Input::get('num', 20))
			->get()
			->toArray();
	}
	
	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store($blog_id)
	{
		$blog = Mmanos\Blog::find($blog_id);
		if (!$blog) {
			App::abort(404);
		}
		
		$validation = Mmanos\Blog\Validator\Post::create($blog, Input::all());
		if ($validation->fails()) {
			App::abort(400, $validation->errors());
		}
		
		$current_user_id = 0;
		$fn = \Config::get('laravel-blog::current_user');
		if ($fn) {
			$current_user_id = $fn();
		}
		
		$post = Mmanos\Blog\Service\Post::create(
			$blog,
			Input::get('content'),
			$current_user_id,
			Input::all()
		);
		
		return $post->toArray();
	}
	
	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($blog_id, $id)
	{
		$blog = Mmanos\Blog::find($blog_id);
		if (!$blog) {
			App::abort(404);
		}
		
		$post = Mmanos\Blog\Post::find($id);
		if (!$post) {
			App::abort(404);
		}
		
		if ($post->blog_id != $blog->id) {
			App::abort(404);
		}
		
		return $post->toArray();
	}
	
	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($blog_id, $id)
	{
		$blog = Mmanos\Blog::find($blog_id);
		if (!$blog) {
			App::abort(404);
		}
		
		$post = Mmanos\Blog\Post::find($id);
		if (!$post) {
			App::abort(404);
		}
		
		if ($post->blog_id != $blog->id) {
			App::abort(404);
		}
		
		$validation = Mmanos\Blog\Validator\Post::update($blog, $post, Input::all());
		if ($validation->fails()) {
			App::abort(400, $validation->errors());
		}
		
		Mmanos\Blog\Service\Post::update($post, Input::all());
		
		return $post->toArray();
	}
	
	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($blog_id, $id)
	{
		$blog = Mmanos\Blog::find($blog_id);
		if (!$blog) {
			App::abort(404);
		}
		
		$post = Mmanos\Blog\Post::find($id);
		if (!$post) {
			App::abort(404);
		}
		
		if ($post->blog_id != $blog->id) {
			App::abort(404);
		}
		
		Mmanos\Blog\Service\Post::delete($post);
	}
	
	/**
	 * Check to see if the requested name is available.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function namecheck($blog_id, $name)
	{
		$blog = Mmanos\Blog::find($blog_id);
		if (!$blog) {
			App::abort(404);
		}
		
		$original  = $name;
		$name      = Str::slug($name);
		$permalink = null;
		
		for ($i = 0; $i < 50; $i++) {
			$tmp_perm = ($i == 0) ? $name : $name . $i;
			
			$taken = Mmanos\Blog\Post::where('blog_id', '=', $blog->id)
				->where('name', '=', $tmp_perm)
				->first();
			
			if (!$taken || $taken->id == Input::get('id')) {
				$permalink = $tmp_perm;
				break;
			}
		}
		
		return array(
			'permalink' => $permalink,
			'changed'   => ($permalink !== $original),
		);
	}
	
	/**
	 * QQ (FineUploader) Image upload action.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function qq($blog_id)
	{
		$blog = Mmanos\Blog::find($blog_id);
		if (!$blog) {
			App::abort(404);
		}
		
		$input = Input::all();
		
		$validation = Validator::make($input, array('qqfile' => 'required'));
		if ($validation->fails()) {
			App::abort(400, $validation->errors());
		}
		
		$file = array_get($input, 'qqfile');
		$filename = null;
		if (is_array($file) && isset($file['tmp_name'])) {
			$filename = $file['name'];
			$file = $file['tmp_name'];
		}
		
		try {
			// Create file.
			// $file = full path to image file
			// $filename name of image file
			//...
		} catch (Exception $e) {
			App::abort(500, "Error creating image ({$e->getMessage()}).");
		}
		
		return array(
			'url' => 'http://www.craveonline.com/images/stories/2011/2012/August/Film/Dumb_and_Dumber.jpg',
		);
	}
}
