<?php
if (empty($blog_id)) {
	return;
}

Casset::add('laravel-blog::/public/css/manager.less');

Casset::add('laravel-blog::/public/libs/multieditor/multieditor.js');
Casset::add('laravel-blog::/public/libs/codemirror/lib/codemirror.css');
Casset::add('laravel-blog::/public/libs/codemirror/lib/codemirror.js');
Casset::add('laravel-blog::/public/libs/codemirror/mode/markdown/markdown.js');
Casset::add('laravel-blog::/public/libs/multieditor/drivers/codemirror.js');
Casset::add('laravel-blog::/public/libs/fineuploader/fineuploader.js');
Casset::add('laravel-blog::/public/libs/fineuploader/jquery.fineuploader.js');
Casset::add('laravel-blog::/public/libs/backbone/underscore.min.js');
Casset::add('laravel-blog::/public/libs/backbone/backbone.min.js');
Casset::add('laravel-blog::/public/libs/dateutil.js');
Casset::add('laravel-blog::/public/libs/markdown/pagedown/converter.js');

Casset::add('laravel-blog::/public/js/manager/views/app.js');
Casset::add('laravel-blog::/public/js/manager/views/viewpage.js');
Casset::add('laravel-blog::/public/js/manager/views/post.js');
Casset::add('laravel-blog::/public/js/manager/views/editpage.js');

Casset::add('laravel-blog::/public/js/manager/models/post.js');
Casset::add('laravel-blog::/public/js/manager/collections/posts.js');

?>

<div id="manager" style="display:none;" data-blogid="<?php echo $blog_id; ?>">
	<div class="navbar navbar-inverse navbar-static-top">
		<div class="container-fluid">
			<div class="navbar-header">
				<a href="#manager" class="navbar-brand">Posts Manager</a>
			</div>
			<div class="collapse navbar-collapse" role="navigation">
				<ul class="nav navbar-nav pull-right">
					<li id="close-link"><a href="javascript:void(0);">Close</a></li>
				</ul>
			</div>
		</div>
	</div>
	
	<div id="viewpage">
		<div id="posts-wrapper">
			<div class="box page-height">
				<div class="actions">
					<ul class="manage-links pull-right">
						<li><a href="javascript:void(0);" title="Add New" id="new-post" class="ico-plus">&nbsp;</a></li>
					</ul>
					
					<h4>Posts</h4>
				</div>
				
				<ul id="posts" class="section-scroll">
					<li id="show-more" style="display:none;">
						<a href="javascript:void(0);" class="btn btn-default btn-block">Show More</a>
					</li>
				</ul>
			</div>
		</div>
		
		<div id="preview-wrapper">
			<div class="box page-height">
				<div class="actions">
					<ul class="manage-links pull-right">
						<li><a href="javascript:void(0);" title="Edit Post" id="edit-post" class="ico-pencil">&nbsp;</a></li>
						<li><a href="javascript:void(0);" title="Delete Post" id="delete-post" class="ico-trash">&nbsp;</a></li>
					</ul>
					
					<h4 class="status">&nbsp;</h4>
				</div>
				
				<div id="preview" class="section-scroll rendered-content"></div>
			</div>
		</div>
	</div>
	
	<div id="editpage" style="display:none;">
		<div id="editor-top">
			<?php echo Form::text('title', '', array('id' => 'editor-title', 'class' => 'form-control', 'placeholder' => 'Enter title here')); ?>
			
			<div id="permalink-wrapper" class="pull-left" style="display:none;">
				<strong>Permalink:</strong>
				/<span id="permalink"></span>
				<a href="javascript:void(0);" id="editor-btn-edit-permalink" class="btn btn-default btn-xs">Edit</a>
			</div>
			<div id="edit-permalink-wrapper" class="pull-left" style="display:none;">
				<strong>Permalink:</strong>
				/<?php echo Form::text('permalink', '', array('id' => 'editor-edit-permalink')); ?>
				<a href="javascript:void(0);" id="editor-btn-save-permalink" class="btn btn-default btn-xs">Done</a>
				<a href="javascript:void(0);" id="editor-btn-cancel-permalink">Cancel</a>
			</div>
			
			<a href="javascript:void(0);" id="editor-btn-save" class="btn btn-primary btn-sm pull-right">Save</a>
			
			<div id="status-wrapper">
				<input type="radio" name="status" value="draft" id="status-draft" /><label for="status-draft">Draft</label>
				<input type="radio" name="status" value="active" id="status-published" /><label for="status-published">Published</label>
			</div>
		</div>
		
		<div id="editor-wrapper">
			<div class="box page-height">
				<div class="actions">
					<h4 class="pull-right">
						<a href="http://daringfireball.net/projects/markdown/basics" target="_blank" title="Markdown Help">?</a>
					</h4>
					
					<h4>Markdown</h4>
				</div>
				
				<div id="editor">
					<?php echo Form::textarea('content', '', array('id' => 'editor-content', 'class' => 'input-block-level')); ?>
				</div>
			</div>
		</div>
		
		<div id="editor-preview-wrapper">
			<div class="box page-height">
				<div class="actions">
					<h4 id="editor-wordcount" class="pull-right">0 words</h4>
					
					<h4>Preview</h4>
				</div>
				
				<div id="editor-preview" class="section-scroll rendered-content"></div>
			</div>
		</div>
	</div>
</div>

<script type="text/template" id="template-post">
    <div class="pull-right">
        <div class="date" title="<%= DateUtil.formatStr(created_at, 'shortTime') %>">
            <%= DateUtil.formatStr(created_at, 'shortDate') %>
        </div>
        <div class="views pull-right">
            <%= num_views %>
        </div>
    </div>
    
    <div class="title">
        <%= title %>
        <% if (!published) { %>
            <span class="label label-info">Draft</span>
        <% } %>
    </div>
    
    <div class="author">User: <%= creator_id %></div>
    
    <div class="clearfix"></div>
</script>
