(function(module) {

function Article (options) {
  Object.keys(options).forEach(function(event, index, keys) {
    this[event] = options[event];
  },this);
}

function Article (options) {
  this.title = options.title;
  this.category = options.category;
  this.body = options.body;
  this.teaser = options.teaser;
  this.publishedOn = options.publishedOn;
}

Article.all = [];
var articlesController = {};
var articleView = {};

$(function () {
  var templateScript = $("#article-template").html();

Article.prototype.toHtml = function() {
  var template = Handlebars.compile(templateScript);

  var theCompiledHtml = template(blogArticles);

  $('.contentPlaceholder').html(theCompiledHtml);

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
  }
});

Article.loadAll = function(rows) {
  Article.all = rows.map(function(ele) {
    return new Article(ele);
  });
};

contents.forEach(function(ele) {
  Article.all.push(new Article(ele));
  })
};

Article.fetchAll = function() {

    $.ajax({
      url: '/js/blogArticles.json',
      dataType: 'JSON',
      type: 'GET',
      success: function(contents) {
        Article.loadAll(contents);
        console.log('successful ajax call');
        Article.initIndexPage();
      }});
};

articleView.handleArticleDisplay = function() {
  $('#contentSelect').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-author="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

    articlesController.loadAll = function(ctx, next) {
      var articleData = function(allArticles) {
        ctx.articles = Article.all;
        next();
      };

      if (Article.all.length) {
        ctx.articles = Article.all;
        next();
      } else {
        Article.fetchAll(articleData);
      }
    };

Article.initIndexPage = function() {
  $('#articles').html('');
  Article.all.forEach(function(contents){
    $('#articles').append(contents.toHtml())
  });
}
$(document).ready(function(){
  articleView.handleArticleDisplay();
  articleView.populateFilters();

});

module.Article = Article;
})(window);
