var Comment = React.createClass({
  render: function() {
    return (
      React.createElement(
        'div',
        {className: 'comment'},
        React.createElement(
          'h2',
          {className: 'commentAuthor'},
          this.props.author
        ),
        this.props.children
      )

      /* JSX
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        {this.props.children}
      </div>
      */
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        React.createElement(Comment, {author: comment.author}, comment.text)
      )
    });
    return (
      React.createElement(
        'div',
        {className: 'commentList'},
        commentNodes
      )
    );

    /* JSX
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
    */
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault(); //フォームのactionを無効化
    //参照用のコンポーネント名からDOMを取得し、value値を取得
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text}); //CommentBoxのhandleCommentSubmit()をコール
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return;
  },
  render: function() {
    return (
      React.createElement(
        'form',
        //actionはpreventDefault()により無効化
        {className: 'commentForm', onSubmit: this.handleSubmit, action: 'http://google.co.jp'},
        //refは参照用のコンポーネント名
        React.createElement('input', {type: 'text', placeholder: 'Your name', ref: 'author'}), 
        React.createElement('input', {type: 'text', placeholder: 'YSay something...', ref: 'text'}),
        React.createElement('input', {type: 'submit', value: 'Post'})
      )

      /* JSX
      <form className="commentForm" onSubmit={this.handleSubmit} action="http://google.co.jp">
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
      */
    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    //リクエスト処理に時間がかかる場合、先にリストに表示しておく
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      React.createElement(
        'div',
        {className: 'commentBox'},
        React.createElement('h1', {}, 'Comments'),
        React.createElement(CommentList, {data: this.state.data}),
        React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
      )

      /* JSX
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
      */
    );
  }
});

React.render(
  React.createElement(CommentBox, {url: 'your.ajax.url', pollInterval: 2000}),
  document.getElementById('content')

  /* JSX
  <CommentBox url="comments.json" pollInterval={2000} />,
  document.getElementById('content')
  */
);
