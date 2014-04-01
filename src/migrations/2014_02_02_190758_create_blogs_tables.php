<?php

use Illuminate\Database\Migrations\Migration;

class CreateBlogsTables extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('blogs', function ($table) {
			$table->increments('id');
			$table->string('title')->nullable();
			$table->text('description')->nullable();
			$table->string('creator_id');
			$table->timestamps();
			$table->softDeletes();
			
			$table->index(array('deleted_at', 'created_at'), 'newest_blogs');
			$table->index(array('deleted_at', 'title', 'created_at'), 'alpha_blogs');
			
			$table->index(array('creator_id', 'deleted_at', 'created_at'), 'newest_user_blogs');
			$table->index(array('creator_id', 'deleted_at', 'title', 'created_at'), 'alpha_user_blogs');
		});
	}
	
	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('blogs');
	}
}