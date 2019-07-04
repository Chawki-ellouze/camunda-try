import Vue from 'vue';

import CamundaRest from '../services/camunda-rest';
import * as FormTypes from './forms';
import form from '../components/forms/myprocess/form';

let convert = require('xml-js');

let getFormJs = function (data,taskDefinitionKey) {
    let xml = data.bpmn20Xml;
    let h = convert.xml2js(xml, {compact: true, spaces: 4});
    let hd = h["bpmn:definitions"]["bpmn:process"]["bpmn:userTask"];

    let valObj = hd.filter(function (elem) {
        if(elem._attributes.id == taskDefinitionKey) return elem;
    })

    return valObj[0];
};


export default Vue.component('GenericForm', {
  props: ['formKey', 'taskId','taskDefinitionKey','processDefinitionId'],
  data() {
    return {
      template: null,
      jsonForm: null,
    };
  },
  render(createElement) {
    if (!this.template) {
      return createElement('div', 'Loading...');
    }
    return this.template();
  },
  mounted() {
    if (this.formKey !== '') {
      this.changeTemplate();
    }
  },
  methods: {
    changeTemplate: function() {

        CamundaRest.getXML(this.processDefinitionId).then((resp) => {

            let jsonForm = getFormJs(resp.data,this.taskDefinitionKey)

            this.jsonForm = jsonForm;

            // console.log(jsonForm);

            this.mycomponent = Vue.compile(`<div>
                <rend-form  :jsonForm="jsonForm" :taskId="taskId" ></rend-form>
              </div>`);

            this.template = this.mycomponent.render;
        });


      // if(typeof FormTypes.myprocess[this.formKey] !== 'undefined'){
      //     const formdata = FormTypes.myprocess[this.formKey].data().formdata;
      //     if (formdata && this.taskId) {
      //         const variables = Object.keys(formdata);
      //         this.loadVariables(variables);
      //     }
      //     this.mycomponent = Vue.compile(`<div>
      //   <component ref="formsChild" :taskId="taskId" v-bind:is="formKey"></component>
      // </div>`);
      //     this.template = this.mycomponent.render;
      // }
    },
    loadVariables: function(variables) {
      CamundaRest.getTaskVariables(this.taskId, variables.join(',')).then((result) => {
        const variableResult = result.data;
        variables.forEach((item) => {
          const itemData = this.$refs.formsChild.formdata[item];
          if (typeof itemData === 'boolean') {
            this.$refs.formsChild.formdata[item] = false;
          } else {
            this.$refs.formsChild.formdata[item] = '';
          }
        });
        Object.keys(variableResult).forEach((item) => {
          this.$refs.formsChild.formdata[item] = variableResult[item].value;
        });
      });
    }
  },
  watch: {
    // formKey: 'changeTemplate',
    taskId: 'changeTemplate',
    taskDefinitionKey: 'changeTemplate'
  },
  components: {
    // adding all forms for myprocess to components
   'rend-form' : form
  }
});
