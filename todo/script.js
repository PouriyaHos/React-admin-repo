var {Component,PropTypes } = React;
var sortBy = _.sortBy;

var cx = window.classNames;

const Icon = ({
  icon }) =>

React.createElement("span", { className: `fa fa-${icon}` });


const TableRow = ({
  row }) =>
{
  return (
    React.createElement("tr", null,
      Object.keys(row).map(key => {
        const td = row[key];
        return (
          React.createElement("td", null, td));
      })
    )
  );
};

const TableHeader = ({
  columns,
  sortColumn,
  sortAsc,
  onTableHeaderClick }) =>
{
  return (
    React.createElement("thead", null,
    columns.map(({ name, key }) => {
      const isActive = sortColumn === key;

      const classes = cx('th', {
        thActive: isActive });


      const icon = isActive ? 
      React.createElement("span", { 
        style: { fontSize: 8 }, 
        children: sortAsc ? '▲' : '▼' }) :
      null;

      return (
        React.createElement(
          "th", { 
            className: classes, 
            key: key, 
            onClick: e => onTableHeaderClick(key) 
          },
        name,
        icon && ' ',
        icon));
    })));


};

const TableBody = ({
  data }) =>
{
  return (
    React.createElement("tbody", null,
    data.map((row, i) =>
    React.createElement(
      TableRow, { 
        row: row, 
        key: i 
      })
    )
  ));
};

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortAsc: true,
      sortColumn: null };

    this.handleTableHeaderClick = this.handleTableHeaderClick.bind(this);
  }

  handleTableHeaderClick(key) {
    const {
      sortColumn,
      sortAsc } =
    this.state;

    if (key === sortColumn) {
      return this.setState({
        sortAsc: !sortAsc });

    }

    this.setState({
      sortAsc: true,
      sortColumn: key });
  }

  render() {
    const {
      columns,
      data } =
    this.props;
    const {
      sortAsc,
      sortColumn } =
    this.state;

    let sortedData = data;

    if (sortColumn) {
      sortedData = sortBy(sortedData, 
        row => row[sortColumn]
      );
    }

    if (!sortAsc) {
      sortedData = sortedData.reverse();
    }

    return (
      React.createElement("table", null, 
      React.createElement(TableHeader, {
        sortAsc: sortAsc,
        sortColumn: sortColumn,
        columns: columns,
        onTableHeaderClick: this.handleTableHeaderClick }),

      React.createElement(TableBody, {
        data: sortedData })
    ));
  }};

Table.propTypes = {
  isLoading: PropTypes.bool,
  defaultSortColumn: PropTypes.string,
  defaultSortAsc: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired })),

  data: PropTypes.array };


Table.defaultProps = {
  defaultSortAsc: true,
  data: [] };


class FilterTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '' };

    this.handleTextChange = this.handleTextChange.bind(this);
  }
  handleTextChange(e) {
    this.props.onTextChange(e.target.value);
    this.setState({
      text: e.target.value });

  }
  render() {
    return (
      React.createElement("div", 
      { style: {
          paddingLeft: 1160,
          paddingBottom: 20,
          paddingTop: 20,
          width: 400
        } 
      }, 

      React.createElement("input", {
        type: "search",
        placeholder: "Search by title",
        onChange: this.handleTextChange })));
  }}


 class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      data: [] };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }
  componentDidMount() {
    window.fetch('https://jsonplaceholder.typicode.com/todos').
    then(res => res.json()).
    then(data => {
      console.log(data);
      this.setState({
        data: data.map(todos => ({
          id: todos.id,
          userId: todos.userId,
          title: todos.title, 
          completed: todos.completed
        })) 
      });
    })
    .catch(err => {
      console.log(err);
    });
  }
  handleSearchChange(term) {
    this.setState({
      searchTerm: term.toLowerCase() });
  }

  render() {
    const { searchTerm, data } = this.state;

    const columns = [
    {
      name: 'ID',
      key: 'id' },

    {
      name: 'User ID',
      key: 'userId' },

    {
      name: 'Todos title',
      key: 'title' },
    {
      name: 'completed/False',
      key: 'completed' }
    ];

    return (
      React.createElement(
        "div", 
        null,
      React.createElement(FilterTextField, { 
        onTextChange: this.handleSearchChange 
      }),

      React.createElement(Table, {
        data: data.filter(
        (row) => (row.id + "").toLowerCase().indexOf(searchTerm) !== -1
        ),
        data: data.filter(
          (row) => (row.userId + "").toLowerCase().indexOf(searchTerm) !== -1
        ),
        data: data.filter(
          (row) => (row.title + "").toLowerCase().indexOf(searchTerm) !== -1
        ),
        columns: columns 
      })
      
    ));
  }
}


 ReactDOM.render(React.createElement(App, null), document.getElementById('root'));