<?php

return array(

	/*
	|--------------------------------------------------------------------------
	| Is Admin Function
	|--------------------------------------------------------------------------
	|
	| Returns true if the current logged in user is able to manage posts.
	|
	*/

	'is_admin' => function () {
		return true;
	},

	/*
	|--------------------------------------------------------------------------
	| Current User Function
	|--------------------------------------------------------------------------
	|
	| Returns the current logged in user's ID.
	|
	*/

	'current_user' => function () {
		return 1;
	},

);
