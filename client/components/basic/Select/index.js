import React, { Component } from 'react'
import Input from '../Input'
import Autosuggest from 'react-autosuggest'
import classnames from 'classnames'
import style from './style.css'

export default class InputSelect extends Component{
  static defaultProps = {
    labelKey: 'text',
  }

  constructor(props){
    super(props)
    this.state = {inputValue:'', selectedItemValue:null, open:false}
  }

  handleChange(selectedOption){
    const {onChange} = this.props
    onChange(selectedOption.value)
  }

  onSuggestionSelected(e, {suggestion}){
    const {onChange} = this.props
    const {value} = suggestion
    this.setState({selectedItemValue:value})
    onChange(value)
  }

  renderSuggestion(item, {query}){
    const {labelKey} = this.props
    const {selectedItemValue} = this.state
    const selectedItem = selectedItemValue === item.value
    return (
      <div className={classnames(style.suggestionItem,{[style.selectedItem]:selectedItem})}>
        {item[labelKey]}
      </div>
    )
  }

  searchChange({value}){
  }

  searchInputChange(e,{newValue, method}){

    if (method !== 'up' && method !== 'down'){
      this.setState({inputValue:newValue})
    }
  }

  render(){
    const {
      label,
      labelKey,
      options,
      error,
      warning,
      value,
    } = this.props

    const {inputValue} = this.state

    return (
      <Autosuggest
          focusInputOnSuggestionClick={false}
          getSuggestionValue={item=>{
            console.log("getSuggestionValue", item);
            return item.value
          }}
          inputProps={{
            placeholder: 'Select...',
            value:inputValue,
            onChange: ::this.searchInputChange,
          }}
          onSuggestionSelected={::this.onSuggestionSelected}
          onSuggestionsClearRequested={()=>{
          }}
          onSuggestionsFetchRequested={::this.searchChange}
          renderInputComponent={(props)=>{
            return (

              <Input
                  containerStyle={{margin:'0'}}
                  hideRightButtonDivider
                  label={label}
                  rightButton={<div className={classnames(style.arrow)}/>}
                  {...props}
              />
            )
          }}
          renderSuggestion={::this.renderSuggestion}
          shouldRenderSuggestions={() => true}
          suggestions={options}
          theme={{
            //input: classnames(style.autosuggestInput),
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
