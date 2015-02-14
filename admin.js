var orders = [
    {}
]

var SearchForm = React.createClass({
    handleChange: function() {
        this.props.onSearchInput(this.refs.searchText.getDOMNode().value);
    },
    render: function() {
        return (
            React.createElement(
                'form',
                {className: 'search-form'},
                React.createElement('input', {className: 'search-text', placeholder: 'キーワードを入力してください', ref: 'searchText', onChange: this.handleChange, value: this.props.searchText})
            )
        );
    }
});

var OrderClumnOnLeft = React.createClass({
    getInitialState: function() {
        return {status: this.props.status, msg: ''};
    },
    handleChangingStatus: function() {
        var status = this.refs.orderStatus.getDOMNode().value;
        var nowDate = new Date();
        var modified = this.__createModified(nowDate);
        this.__updateStatus(status, this.props.tradingId, modified);
    },
    __createModified: function(nowDate) {
        return nowDate.getFullYear() + 
            '-' + ('0' + nowDate.getMonth() + 1).slice(-2) + 
            '-' + ('0' + nowDate.getDate()).slice(-2) + 
            ' ' 
                + ('0' + nowDate.getHours()).slice(-2) + 
            ':' + ('0' + nowDate.getMinutes()).slice(-2) + 
            ':' + ('0' + nowDate.getSeconds()).slice(-2);
    },
    __hideUpdateMessage: function() {
        this.setState({msg: ''});
    },
    __updateStatus: function(status, tradingId, modified) {
        $.ajax({
            url: '/echo/json/',
            dataType: 'json',
            type: 'POST',
            data: {},
            success: function(data) {
                this.setState({status: status, msg: '更新しました。'});
                this.props.onChangingModified(modified, status);
                setTimeout(this.__hideUpdateMessage, 2000);
            }.bind(this),
            error: function() {
                this.setState({msg: '更新できませんでした。'});
                setTimeout(this.__hideUpdateMessage, 2000);
            }.bind(this)
        });
    },
    render: function() {
        var options = [{text: '未対応', value: 0, selectedClass: 'non-support'}, {text: '発注手続済', value: 1, selectedClass: 'complete'}, {text: 'キャンセル', value: 9, selectedClass: 'cancel'}];
        var selectedStatus = ''
        var optionNodes = $.map(options, function(option) {
            return React.createElement('option', {value: option.value}, option.text)
        });

        return (
            React.createElement(
                'div',
                {className: 'order-column'},
                React.createElement('p', {className: 'order__trading-id'}, this.props.tradingId),
                React.createElement('select', {className: 'order__status', onChange: this.handleChangingStatus, ref: 'orderStatus', value: this.state.status}, optionNodes),
                React.createElement('p', {className: 'order__update-message', ref: 'updateMessage'}, this.state.msg)
            )
        );
    }
});

var Order = React.createClass({
    getInitialState: function() {
        var selectedStatus = this.__getselectedStatus(this.props.status);
        return {modified: this.props.modified, className: 'order--' + selectedStatus};
    },
    handlerChangingModified: function(modified, status) {
        var selectedStatus = this.__getselectedStatus(status);
        this.setState({modified: modified, className: 'order--' + selectedStatus});
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
            React.createElement(
                'li',
                {className: this.state.className},
                React.createElement(OrderClumnOnLeft, {status: this.props.status, tradingId: this.props.tradingId, onChangingModified: this.handlerChangingModified}),
                React.createElement(
                    'div',
                    {className: 'order-column'},
                    React.createElement('p', {className: 'order__text'}, this.props.userName),
                    React.createElement('p', {className: 'order__text'}, this.props.email),
                    React.createElement('p', {className: 'order__text'}, this.props.phone),
                    React.createElement('p', {className: 'order__text'}, this.props.number)
                ),
                React.createElement(
                    'div',
                    {className: 'order-column'},
                    React.createElement('p', {className: 'order__text'}, this.props.zip),
                    React.createElement('p', {className: 'order__text'}, this.props.addressLine),
                    React.createElement('p', {className: 'order__text'}, this.props.mainAddress)
                ),
                React.createElement(
                    'div',
                    {className: 'order-column'},
                    React.createElement('p', {className: 'order__text'}, this.props.created),
                    React.createElement('p', {className: 'order__text'}, this.state.modified)
                )
            )
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

    render: function() {
        var orderNodes = this.props.orders.map(function (order) {
            if (!this.__search(order)) {
                return;
            }

            return (
                React.createElement(
                    Order,
                    {
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
                        modified: order.modified
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
            orders: this.props.orders
        };
    },
    handleSearchInput: function(searchText) {
        this.setState({
            searchText: searchText
        });
    },
    render: function() {
        return (
            React.createElement(
                'section',
                {className: 'section'},
                React.createElement(SearchForm, {searchText: this.state.searchText, onSearchInput: this.handleSearchInput}),
                React.createElement(OrderList, {orders: this.state.orders, searchText: this.state.searchText})
            )
        );
    }
});

console.log(orders.length);
React.render(
    React.createElement(Section, {orders: orders}),
    document.getElementById('content')
);