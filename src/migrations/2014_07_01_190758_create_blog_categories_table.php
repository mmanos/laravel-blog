<?php

use Illuminate\Database\Migrations\Migration;

class CreateBlogCategoriesTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('blog_categories', function ($table) {
			$table->increments('id');
			$table->integer('blog_id');
			$table->string('title');
			$table->text('description')->nullable();
			$table->string('name')->nullable();
			$table->string('creator_id');
			$table->timestamps();
			$table->softDeletes();
			
			$table->index(array('deleted_at', 'created_at'), 'newest_blog_categories');
			$table->index(array('deleted_at', 'title', 'created_at'), 'alpha_blog_categories');
			
			$table->index(array('creator_id', 'deleted_at', 'created_at'), 'newest_user_blog_categories');
			$table->index(array('creator_id', 'deleted_at', 'title', 'created_at'), 'alpha_user_blog_categories');
			
			$table->index(array('blog_id', 'name', 'created_at'), 'idx_name');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('blog_categories');
	}
}
