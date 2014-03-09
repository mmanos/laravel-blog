<?php

Route::any('blogadmin/{blog_id}/posts/qq', 'AdminpostsController@qq');
Route::get('blogadmin/{blog_id}/posts/namecheck/{name}', 'AdminpostsController@namecheck');
Route::resource('blogadmin.posts', 'AdminpostsController');