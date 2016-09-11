import React from 'react';

class OptionColander extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
			query: '',
      options: [],
			filteredOptions: []
		}
		this.handleInput = (event) => {
			this.setState({
				query: event.target.value,
			}, () => {
        this.filterOptions()
      });
		}
		this.handleCheck = (event) => {
      // Ensure the change event is always triggered on the containing form
      const changeTrigger = new Event('change', { bubbles: true });
      event.target.dispatchEvent(changeTrigger);

			if(this.props.multiple === "false") {
				this.state.filteredOptions.map(item => item.optionColanderIsChecked = false);
			}
      let option = this.state.options.find((item) => {
        return String(item[this.props.uniqueKey]) === String(event.target.value);
      });
      if(typeof option !== 'undefined') {
        option.optionColanderIsChecked = event.target.checked;
        this.filterOptions();
      }
		};
    // Filter options from the array
    this.filterOptions = () => {
      let pattern = new RegExp(this.state.query.trim(), 'i');
      let filteredOptions = this.state.options.filter((item) => {
        return item.optionColanderIsChecked || pattern.test(item[this.props.labelKey]);
      }).sort(this.optionSort).slice(0, this.props.resultAmount);
      this.setState({
        filteredOptions: filteredOptions
      });
    };
    this.optionSort = (a,b) => {
      return (Boolean(a.optionColanderIsChecked) === Boolean(b.optionColanderIsChecked)
              ? (this.state.query.trim().length > 0 ? this.alphabeticalSort(a,b) : this.defaultSort(a,b))
              : a.optionColanderIsChecked ? -1 : 1);
    }
    this.defaultSort = (a,b) => {
      return (this.props.defaultItems.indexOf(a[this.props.uniqueKey]) === this.props.defaultItems.indexOf(b[this.props.uniqueKey])
              ? this.alphabeticalSort(a,b)
              : this.props.defaultItems.indexOf(a[this.props.uniqueKey]) !== -1 ? -1 : 1);
    }
    this.alphabeticalSort = (a,b) => {
      return (a[this.props.labelKey].toUpperCase() > b[this.props.labelKey].toUpperCase() ? 1 : -1);
    }
	}
  componentWillReceiveProps(nextProps) {
    const originalOptions = nextProps.options.map((item) => {
      if(nextProps.selectedItems.indexOf(String(item[nextProps.uniqueKey])) !== -1 ) {
        item.optionColanderIsChecked = true;
      }
      return item;
    }).sort(this.optionSort);
    this.setState({
      options: nextProps.options,
      filteredOptions: originalOptions.slice(0, nextProps.resultAmount)
    });
  }
	componentWillMount() {
    this.setState({
      options: this.props.options,
      filteredOptions: this.props.options.slice(0, this.props.resultAmount)
    });
	}
  render() {
    return (
      <div className="option-colander">
        <input type="search" className="option-colander__query" placeholder={this.props.queryPlaceholder} onChange={this.handleInput} />
        <div className="option-colander__list">
          {this.state.filteredOptions.map((item) => {
            return (
              <label className="option-colander__item" key={item[this.props.uniqueKey]}>
                <input  name={this.props.name}
                        type={(this.props.multiple === "true") ? 'checkbox' : 'radio'}
                        value={item[this.props.uniqueKey]}
                        checked={(item.optionColanderIsChecked ? 'checked' : '')}
                        onChange={this.handleCheck} />
                <span className="option-colander__item_control">{item[this.props.labelKey]}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }
}

OptionColander.defaultProps = {
  name: 'colander',
  options: [],
  multiple: 'true',
  queryPlaceholder: 'Search',
  defaultQuery: '',
  uniqueKey: 'id',
  labelKey: 'name',
  resultAmount: 10,
  defaultItems: [],
  selectedItems: []
}

export default OptionColander;
