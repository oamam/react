
var SearchForm = React.createClass({
    getInitialState: function() {
        return {
            searchStatus: '',
            searchText: ''
        }
    },
    handleSearch: function() {
        var searchText = this.refs.searchText.getDOMNode().value;
        var searchStatus = this.refs.searchStatus.getDOMNode().value;

        this.setState({
            searchText: searchText,
            searchStatus: searchStatus
        });
        
        this.props.onSearch(searchText, searchStatus);
    },
    render: function() {
        var statusSelector = '';

        if (admin.type == 1) {
            statusSelector = React.createElement(
                'select',
                {className: 'search-status', ref: 'searchStatus', onChange: this.handleSearch, value: this.state.searchStatus},
                React.createElement('option', {value: ''}, 'すべて'),
                React.createElement('option', {value: 0}, '未対応'),
                React.createElement('option', {value: 1}, '出荷可能'),
                React.createElement('option', {value: 9}, 'キャンセル')
            );

        } else if (admin.type == 2) {
            statusSelector = React.createElement(
                'select',
                {className: 'search-status', ref: 'searchStatus', onChange: this.handleSearch, value: this.state.searchStatus},
                React.createElement('option', {value: ''}, 'すべて'),
                React.createElement('option', {value: 1}, '出荷可能'),
                React.createElement('option', {value: 2}, '出荷済')
            );

        } else {
            statusSelector = React.createElement(
                'select',
                {className: 'search-status', ref: 'searchStatus', onChange: this.handleSearch, value: this.state.searchStatus},
                React.createElement('option', {value: ''}, 'すべて'),
                React.createElement('option', {value: 0}, '未対応'),
                React.createElement('option', {value: 1}, '出荷可能'),
                React.createElement('option', {value: 2}, '出荷済'),
                React.createElement('option', {value: 9}, 'キャンセル')
            );
        }

        return (
            <form className="search-form">
                <input type="text" className="search-text" placeholder="キーワードを入力してください" ref="searchText" onChange={this.handleSearch} value={this.state.searchText} />
                {statusSelector}
            </form>
        );
    }
});


var Order = React.createClass({
    getInitialState: function() {
        var selectedStatus = this.__getselectedStatus(this.props.status);
        return {
            status: this.props.status,
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
            status: status,
            modified: modified,
            className: 'order--' + selectedStatus,
            message: '更新しました。'
        });
        var $orderMessage = $(this.refs.orderMessage.getDOMNode());
        $orderMessage.show();
        setTimeout(function() {
            $orderMessage.fadeOut(1000);
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
        var options = [
            {text: '未対応', value: 0, selectedStatus: 'non-support'},
            {text: '出荷可能', value: 1, selectedStatus: 'shipment-enable'},
            {text: '出荷済', value: 2, selectedStatus: 'shipment-complete'},
            {text: 'キャンセル', value: 9, selectedStatus: 'cancel'}
        ];
        
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
        var statusSelector = '';

        if (admin.type == 1) {
            statusSelector = React.createElement(
                'select',
                {className: 'order__status', ref: 'orderStatus', onChange: this.handlerStatusChange, value: this.state.status},
                React.createElement('option', {value: 0}, '未対応'),
                React.createElement('option', {value: 1}, '出荷可能'),
                React.createElement('option', {value: 9}, 'キャンセル')
            );

        } else if (admin.type == 2) {
            statusSelector = React.createElement(
                'select',
                {className: 'order__status', ref: 'orderStatus', onChange: this.handlerStatusChange, value: this.state.status},
                React.createElement('option', {value: 1}, '出荷可能'),
                React.createElement('option', {value: 2}, '出荷済')
            );

        } else {
            statusSelector = React.createElement(
                'select',
                {className: 'order__status', ref: 'orderStatus', onChange: this.handlerStatusChange, value: this.state.status},
                React.createElement('option', {value: 0}, '未対応'),
                React.createElement('option', {value: 1}, '出荷可能'),
                React.createElement('option', {value: 2}, '出荷済'),
                React.createElement('option', {value: 9}, 'キャンセル')
            );
        }

        return (
            <li className={this.state.className} ref="order">
                <div className="order-column">
                    <p className="order__trading-id">{this.props.tradingId}</p>
                    {statusSelector}
                    <p className="order__message" ref="orderMessage">{this.state.message}</p>
                </div>
                <div className="order-column">
                    <p className="order__text">{this.props.userName}</p>
                    <p className="order__text">{this.props.zip}</p>
                    <p className="order__text">{this.props.addressLine}</p>
                    <p className="order__text">{this.props.mainAddress}</p>
                </div>
                <div className="order-column">
                    <p className="order__text">{this.props.email}</p>
                    <p className="order__text">{this.props.phone}</p>
                    <p className="order__text">{this.props.quantity}</p>
                    <p className="order__text">{this.props.totalPrice}</p>
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
            this.props.searchText === '' ||
            order.trading_id.indexOf(this.props.searchText) >= 0 ||
            order.trading_id.toLowerCase().indexOf(this.props.searchText.toLowerCase()) >= 0 ||
            order.first_name.indexOf(this.props.searchText) >= 0 ||
            order.first_name.toLowerCase().indexOf(this.props.searchText.toLowerCase()) >= 0 ||
            order.last_name.indexOf(this.props.searchText) >= 0 ||
            order.last_name.toLowerCase().indexOf(this.props.searchText.toLowerCase()) >= 0 ||
            order.email.indexOf(this.props.searchText) >= 0 ||
            order.phone.indexOf(this.props.searchText) >= 0 ||
            order.quantity.indexOf(this.props.searchText) >= 0 ||
            order.total_price.indexOf(this.props.searchText) >= 0 ||
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
        ) && (
            this.props.searchStatus === '' ||
            order.status === this.props.searchStatus
        );
    },

    getInitialState: function() {
        return {
            orders: []
        }
    },

    loadOrdersFromServer: function() {
        $.ajax({
            url: 'admin.php',
            dataType: 'json',
            type: 'GET',
            success: function(orders) {
                this.setState({
                    orders: orders
                });
            }.bind(this),
            error: function() {
                console.log('ng');
            }.bind(this)
        });
    },

    componentDidMount: function() {
       this.loadOrdersFromServer();
    },

    handlerStatusChange: function(tradingId, status, modified) {
        $.ajax({
            url: 'admin.php',
            dataType: 'json',
            type: 'POST',
            data: {
                status: status,
                trading_id: tradingId,
                modified: modified
            },
            success: function(data) {
                this.loadOrdersFromServer();
            }.bind(this),
            error: function() {
                this.setState({msg: '更新できませんでした。'});
                setTimeout(this.__hideUpdateMessage, 2000);
            }.bind(this)
        });
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
                        quantity: order.quantity,
                        zip: order.zip,
                        addressLine: order.address_line_1 + ' ' + order.address_line_2,
                        mainAddress: order.city + ' ' + order.spr + ' ' + order.country,
                        totalPrice: order.total_price,
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
            searchText: '',
            searchStatus: ''
        };
    },
    handleSearch: function(searchText, searchStatus) {
        this.setState({
            searchText: searchText,
            searchStatus: searchStatus
        });
    },
    render: function() {
        return (
            <section className="section">
                <SearchForm searchText={this.state.searchText} searchStatus={this.state.searchStatus} onSearch={this.handleSearch} />
                <div className="section-logout"><a href="./logout.php" className="section-logout__button">ログアウト</a></div>
                <OrderList searchText={this.state.searchText} searchStatus={this.state.searchStatus} />
            </section>
        );
    }
});

React.render(
    <Section />,
    document.getElementById('content')
);