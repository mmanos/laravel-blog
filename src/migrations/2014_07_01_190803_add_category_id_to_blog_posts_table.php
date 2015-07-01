<?php

use Illuminate\Database\Migrations\Migration;

class AddCategoryIdToBlogPostsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('blog_posts', function ($table) {
			$table->integer('category_id')->nullable()->after('creator_id');
			
			$table->index(array('blog_id', 'category_id', 'deleted_at', 'created_at', 'published'), 'newest_category_blog_posts');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('blog_posts', function ($table) {
			$table->dropColumn('category_id');
			
			$table->dropIndex('newest_category_blog_posts');
		});
	}
}
