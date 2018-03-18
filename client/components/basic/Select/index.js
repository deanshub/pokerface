import React, { Component } from 'react'
import Input from '../Input'
import Autosuggest from 'react-autosuggest'
import classnames from 'classnames'
import style from './style.css'

export default class InputSelect extends Component{
  static defaultProps = {
    labelKey: 'text',
    options: [],
  }

  constructor(props){
    super(props)
    const {value, options} = this.props

    let selectedItem = null
    if (value){
      selectedItem = options.find(option => value === option.value)
    }

    this.state = {
      filteredOptions:options,
      inputValue:'',
      selectedItem:selectedItem,
      showSelectedItem:true,
    }
  }

  getSelectedText(){
    const {labelKey} = this.props
    const {selectedItem} = this.state
    return selectedItem?selectedItem[labelKey]:''
  }

  handleChange(selectedOption){
    const {onChange} = this.props
    onChange(selectedOption.value)
  }

  onBlur(){
    this.setState({showSelectedItem:true})
  }

  onSuggestionSelected(e, {suggestion}){
    const {onChange} = this.props
    this.setState({selectedItem:suggestion})

    onChange(suggestion.value)
  }

  renderSuggestion(item, {query}){
    const {labelKey} = this.props
    const {selectedItem} = this.state
    const currentSelectedItem = !!selectedItem && selectedItem.value === item.value

    return (
      <div className={classnames(style.suggestionItem,{[style.selectedItem]:currentSelectedItem})}>
        {item[labelKey]}
      </div>
    )
  }

  searchChange({value}){
    const {inputValue} = this.state
    const {labelKey, options} = this.props

    const filteredOptions = options.filter(option => option[labelKey].toUpperCase().startsWith(value.toUpperCase()))
    this.setState({filteredOptions})
  }

  searchInputChange(e,{newValue, method}){
    if (method !== 'up' && method !== 'down'){
      this.setState({inputValue:newValue})
    }
  }

  render(){
    const {
      id,
      label,
      labelKey,
      options,
      error,
      warning,
      value,
    } = this.props

    const {inputValue, filteredOptions, showSelectedItem} = this.state

    return (
      <Autosuggest
          focusInputOnSuggestionClick={false}
          getSuggestionValue={item=>{
            return item.value
          }}
          id={id}
          inputProps={{
            placeholder: this.getSelectedText()||'Select...',
            value: showSelectedItem?this.getSelectedText():inputValue,
            onChange: ::this.searchInputChange,
            onFocus: () => {this.setState({inputValue:'', showSelectedItem:false})},
            onBlur: ::this.onBlur,
          }}
          onSuggestionSelected={::this.onSuggestionSelected}
          onSuggestionsClearRequested={()=>{
            this.setState({filteredOptions:options})
          }}
          onSuggestionsFetchRequested={::this.searchChange}
          renderInputComponent={(props)=>{
            return (

              <Input
                  containerStyle={{margin:'0'}}
                  error={error}
                  hideRightButtonDivider
                  label={label}
                  rightButton={<div className={classnames(style.arrow)}/>}
                  warning={warning}
                  {...props}
              />
            )
          }}
          renderSuggestion={::this.renderSuggestion}
          shouldRenderSuggestions={() => (true)}
          suggestions={inputValue?filteredOptions:options}
          theme={{
            container: classnames(style.selectContainer),
            containerOpen: classnames(style.containerOpen),
            suggestionsList: classnames(style.suggestionsList),
            suggestion: classnames(style.suggestion),
            suggestionHighlighted: classnames(style.suggestionHighlighted),
            suggestionFirst: classnames(style.suggestionFirst),
            suggestionsContainer: classnames(style.suggestionsContainer),
            suggestionsContainerOpen: classnames(style.suggestionsContainerOpen),
          }}
      />
    )
  }
}
