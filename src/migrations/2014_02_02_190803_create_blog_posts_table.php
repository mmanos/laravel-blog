<?php

use Illuminate\Database\Migrations\Migration;

class CreateBlogPostsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('blog_posts', function ($table) {
			$table->increments('id');
			$table->integer('blog_id');
			$table->string('title');
			$table->text('content');
			$table->string('name')->nullable();
			$table->integer('parent_id')->nullable();
			$table->integer('num_views')->default(0);
			$table->float('rating')->default(0);
			$table->boolean('published')->default(1);
			$table->string('user_ip')->nullable();
			$table->string('creator_id');
			$table->timestamps();
			$table->softDeletes();
			
			$table->index(array('blog_id', 'deleted_at', 'created_at', 'published'), 'newest_blog_posts');
			$table->index(array('blog_id', 'deleted_at', 'rating', 'created_at', 'published'), 'best_blog_posts');
			$table->index(array('blog_id', 'deleted_at', 'num_views', 'created_at', 'published'), 'popular_blog_posts');
			
			$table->index(array('parent_id', 'deleted_at', 'created_at', 'published'), 'newest_child_posts');
			$table->index(array('parent_id', 'deleted_at', 'rating', 'created_at', 'published'), 'best_child_posts');
			$table->index(array('parent_id', 'deleted_at', 'num_views', 'created_at', 'published'), 'popular_child_posts');
			
			$table->index(array('blog_id', 'name', 'created_at', 'published'), 'idx_name');
		});
	}
	
	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('blog_posts');
	}
}