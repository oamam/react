var randobet = function(n, b) {
    b = b || '';
    var a = 'abcdefghijklmnopqrstuvwxyz'
        + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        + '0123456789'
        + b;
    a = a.split('');
    var s = '';
    for (var i = 0; i < n; i++) {
        s += a[Math.floor(Math.random() * a.length)];
    }
    return s;
};

var orders = [
    {'trading_id': randobet(10),'first_name': 'masashi','last_name': 'amao','email': 'example@google.com','phone': '123456789','number': '10','zip': '123456789','address_line_1': 'address_line_1','address_line_2': 'address_line_2','city': 'city','spr': 'spr','country': 'country','created': '2000-01-01 00:00:00','modified': '2000-01-01 00:00:00'},
    {'trading_id': randobet(10),'first_name': 'masashi','last_name': 'amao','email': 'example@google.com','phone': '123456789','number': '10','zip': '123456789','address_line_1': 'address_line_1','address_line_2': 'address_line_2','city': 'city','spr': 'spr','country': 'country','created': '2000-01-01 00:00:00','modified': '2000-01-01 00:00:00'},
    {'trading_id': randobet(10),'first_name': 'masashi','last_name': 'amao','email': 'example@google.com','phone': '123456789','number': '10','zip': '123456789','address_line_1': 'address_line_1','address_line_2': 'address_line_2','city': 'city','spr': 'spr','country': 'country','created': '2000-01-01 00:00:00','modified': '2000-01-01 00:00:00'},
    {'trading_id': randobet(10),'first_name': 'masashi','last_name': 'amao','email': 'example@google.com','phone': '123456789','number': '10','zip': '123456789','address_line_1': 'address_line_1','address_line_2': 'address_line_2','city': 'city','spr': 'spr','country': 'country','created': '2000-01-01 00:00:00','modified': '2000-01-01 00:00:00'},
    {'trading_id': randobet(10),'first_name': 'masashi','last_name': 'amao','email': 'example@google.com','phone': '123456789','number': '10','zip': '123456789','address_line_1': 'address_line_1','address_line_2': 'address_line_2','city': 'city','spr': 'spr','country': 'country','created': '2000-01-01 00:00:00','modified': '2000-01-01 00:00:00'},
    {'trading_id': randobet(10),'first_name': 'masashi','last_name': 'amao','email': 'example@google.com','phone': '123456789','number': '10','zip': '123456789','address_line_1': 'address_line_1','address_line_2': 'address_line_2','city': 'city','spr': 'spr','country': 'country','created': '2000-01-01 00:00:00','modified': '2000-01-01 00:00:00'},
    {'trading_id': randobet(10),'first_name': 'masashi','last_name': 'amao','email': 'example@google.com','phone': '123456789','number': '10','zip': '123456789','address_line_1': 'address_line_1','address_line_2': 'address_line_2','city': 'city','spr': 'spr','country': 'country','created': '2000-01-01 00:00:00','modified': '2000-01-01 00:00:00'},
    {'trading_id': randobet(10),'first_name': 'masashi','last_name': 'amao','email': 'example@google.com','phone': '123456789','number': '10','zip': '123456789','address_line_1': 'address_line_1','address_line_2': 'address_line_2','city': 'city','spr': 'spr','country': 'country','created': '2000-01-01 00:00:00','modified': '2000-01-01 00:00:00'},
    {'trading_id': randobet(10),'first_name': 'masashi','last_name': 'amao','email': 'example@google.com','phone': '123456789','number': '10','zip': '123456789','address_line_1': 'address_line_1','address_line_2': 'address_line_2','city': 'city','spr': 'spr','country': 'country','created': '2000-01-01 00:00:00','modified': '2000-01-01 00:00:00'}
];

var SearchForm = React.createClass({
    handleSearch: function() {
        this.props.onSearch(this.refs.searchText.getDOMNode().value);
    },
    render: function() {
        return (
            <form className="search-form">
                <input type="text" className="search-text" placeholder="キーワードを入力してください" ref="searchText" onChange={this.handleSearch} value={this.props.searchText} />
            </form>
        );
    }
});


var Order = React.createClass({
    getInitialState: function() {
        var selectedStatus = this.__getselectedStatus(this.props.status);
        return {
            modified: this.props.modified,
            className: 'order--' + selectedStatus,
            message: ''
        };
    },
    handlerStatusChange: function() {
        var status = this.refs.orderStatus.getDOMNode().value;
        var tradingId = this.props.tradingId;
        var modified = this.__createModified();
        var selectedStatus = this.__getselectedStatus(status);
        this.props.onStatusChange(tradingId, status, modified);
        this.setState({
            modified: modified,
            className: 'order--' + selectedStatus,
            message: '更新しました。'
        });
        
        var $orderMessage = $(this.refs.orderMessage.getDOMNode());
        setTimeout(function() {
            $orderMessage.fadeOut(1000, function() {$orderMessage.empty(); });
        }, 1000);
    },
    __createModified: function() {
        var nowDate = new Date();
        return nowDate.getFullYear() + 
            '-' + ('0' + nowDate.getMonth() + 1).slice(-2) + 
            '-' + ('0' + nowDate.getDate()).slice(-2) + 
            ' ' 
                + ('0' + nowDate.getHours()).slice(-2) + 
            ':' + ('0' + nowDate.getMinutes()).slice(-2) + 
            ':' + ('0' + nowDate.getSeconds()).slice(-2);
    },
    __getselectedStatus: function(status) {
        var options = [{text: '未対応', value: 0, selectedStatus: 'non-support'}, {text: '発注手続済', value: 1, selectedStatus: 'complete'}, {text: 'キャンセル', value: 9, selectedStatus: 'cancel'}];
        var selectedStatus = '';

        for (i = 0, l = options.length; i < l; i++) {
            var option = options[i];
            if (option.value == parseInt(status)) {
                selectedStatus = option.selectedStatus;
                break;
            }
        }
        return selectedStatus;
    },
    render: function() {
        return (
            <li className={this.state.selectedStatus} ref="order">
                <div className="order-column">
                    <p className="order__trading-id">{this.props.tradingId}</p>
                    <select className="order__status" ref="orderStatus" onChange={this.handlerStatusChange} value={this.props.status}>
                        <option value="0">未対応</option>
                        <option value="1">発注手続済</option>
                        <option value="9">キャンセル</option>
                    </select>
                    <p className="order__message" ref="orderMessage">{this.state.message}</p>
                </div>
                <div className="order-column">
                    <p className="order__text">{this.props.userName}</p>
                    <p className="order__text">{this.props.email}</p>
                    <p className="order__text">{this.props.phone}</p>
                    <p className="order__text">{this.props.number}</p>
                </div>
                <div className="order-column">
                    <p className="order__text">{this.props.zip}</p>
                    <p className="order__text">{this.props.addressLine}</p>
                    <p className="order__text">{this.props.mainAddress}</p>
                </div>
                <div className="order-column">
                    <p className="order__text">{this.props.created}</p>
                    <p className="order__text">{this.state.modified}</p>
                </div>
            </li>
        );
    }
});

var OrderList = React.createClass({
    __search: function(order) {
        return (
            order.trading_id.indexOf(this.props.searchText) >= 0 ||
            order.trading_id.toLowerCase().indexOf(this.props.searchText.toLowerCase()) >= 0 ||
            order.first_name.indexOf(this.props.searchText) >= 0 ||
            order.first_name.toLowerCase().indexOf(this.props.searchText.toLowerCase()) >= 0 ||
            order.last_name.indexOf(this.props.searchText) >= 0 ||
            order.last_name.toLowerCase().indexOf(this.props.searchText.toLowerCase()) >= 0 ||
            order.email.indexOf(this.props.searchText) >= 0 ||
            order.phone.indexOf(this.props.searchText) >= 0 ||
            order.number.indexOf(this.props.searchText) >= 0 ||
            order.zip.indexOf(this.props.searchText) >= 0 ||
            order.address_line_1.indexOf(this.props.searchText) >= 0 ||
            order.address_line_1.toLowerCase().indexOf(this.props.searchText.toLowerCase()) >= 0 ||
            order.address_line_2.indexOf(this.props.searchText) >= 0 ||
            order.address_line_2.toLowerCase().indexOf(this.props.searchText.toLowerCase()) >= 0 ||
            order.city.indexOf(this.props.searchText) >= 0 ||
            order.city.toLowerCase().indexOf(this.props.searchText.toLowerCase()) >= 0 ||
            order.spr.indexOf(this.props.searchText) >= 0 ||
            order.spr.toLowerCase().indexOf(this.props.searchText.toLowerCase()) >= 0 ||
            order.country.indexOf(this.props.searchText) >= 0 ||
            order.country.toLowerCase().indexOf(this.props.searchText.toLowerCase()) >= 0
        );
    },

    getInitialState: function() {
        return {
            orders: []
        }
    },

    componentDidMount: function() {
        this.setState({
            orders: orders
        });
    },

    handlerStatusChange: function(tradingId, status, modified) {
        var i, l;
        for (i = 0, l = orders.length; i < l; i++) {
            if (orders[i].trading_id == tradingId) {
                console.log(status);
                orders[i].status = status;
                orders[i].modified = modified;
                break;
            }
        }
        return true;
    },

    render: function() {
        var orderNodes = this.state.orders.map(function (order) {
            if (!this.__search(order)) {
                return;
            }

            return (
                React.createElement(
                    Order,
                    {
                        key: order.trading_id,
                        tradingId: order.trading_id,
                        userName: order.first_name + ' ' + order.last_name,
                        email: order.email,
                        phone: order.phone,
                        number: order.number,
                        zip: order.zip,
                        addressLine: order.address_line_1 + ' ' + order.address_line_2,
                        mainAddress: order.city + ' ' + order.spr + ' ' + order.country,
                        status: order.status,
                        created: order.created,
                        modified: order.modified,
                        onStatusChange: this.handlerStatusChange
                    }
                )
            );
        }, this);
        return (
            React.createElement(
                'ul',
                {className: 'order-list'},
                orderNodes
            )
        );
    }
});

var Section = React.createClass({
    getInitialState: function() {
        return {
            searchText: ''
        };
    },
    handleSearch: function(searchText) {
        this.setState({
            searchText: searchText
        });
    },
    render: function() {
        return (
            <section className="section">
                <SearchForm searchText={this.state.searchText} onSearch={this.handleSearch} />
                <OrderList searchText={this.state.searchText} />
            </section>
        );
    }
});

React.render(
    <Section />,
    document.getElementById('content')
);