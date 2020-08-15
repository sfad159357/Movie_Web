import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./Input";
import Select from "./Select";

export default class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validProperty = ({ name, value }) => {
    // 原參數input，等效於input.name, input.value
    const formObj = { [name]: value }; // 單一form state
    const subSchema = { [name]: this.schema[name] }; // 由於單一form只有單一屬性，不能使用完整的schema，要另外宣告subSchema
    const result = Joi.validate(formObj, subSchema); // 這裡參3由於我們希望使用者在輸入單一輸入框，只挑出一行error訊息，太多反而會很干擾
    return result.error ? result.error.details[0].message : ""; // Joi.validate()驗證完ok，回傳的error為null。所以如果作為條件式不能寫成error.xxx...，因為null讀取不到在runtime會呠error。
  };

  validate = () => {
    const options = { abortEarly: false }; // 參3為false，是將全部的error訊息顯示出來，讓使用者知道提交後還有哪裡的格式不對
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null; // 為了要讓errors可被條件式判斷，才會回傳null

    const errors = {};
    for (let item of error.details) {
      errors[item.path] = item.message;
    }
    return errors;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} }); // 為了讓username和password能夠參照沒有error的errors<
    // -> 使用 || or選擇器，沒有errors，不要設null，而是{}狀態
    if (errors) return; // 如果有errors，就停止函式繼續往下執行
    this.doSubmit();
  };

  handleChange = ({ target: input }) => {
    // target = event.target
    // const input = event.target
    // 每次只要輸入框內的一個字元改變，就會setState一次，然後重新render()
    const errors = { ...this.state.errors };
    const errorMessage = this.validProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name]; // 如果沒有出現error，就刪掉errors狀態屬性，不然會一直出現

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors }); // data被重設完值，再render一次，所輸入的值才會顯示到頁面上
  };

  renderInput = (name, label, type = "text") => {
    const { data, errors } = this.state;

    return (
      <Input
        name={name}
        label={label}
        type={type}
        value={data[name]} // 如果data有值，就會顯示在頁面讓使用者知道多少值
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  };

  renderSelect = (name, label, options) => {
    const { data, errors } = this.state;

    return (
      <Select
        name={name}
        label={label}
        options={options}
        value={data[name]} // 顯示在頁面使用者看得到文字
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  };

  renderButton = (label) => {
    return (
      <input
        type="submit"
        value={label}
        className="btn btn-primary mt-4"
        disabled={this.validate()} // 有值代表有error，為truthy，所以開啟disabled，取消submit功能
      />
    );
  };
}
