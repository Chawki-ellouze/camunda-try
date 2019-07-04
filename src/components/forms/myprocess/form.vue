<style>
    .radio-toolbar input[type="radio"] {
        display:none;
    }
    .radio-toolbar label {
        display:inline-block;
        background-color:#ddd;
        padding: 10px 20px;
        font-family:Arial;
        font-size:16px;
        border: 2px solid #444;
        border-radius: 4px;
    }
    .radio-toolbar label {
        display:inline-block;
        background-color:#ddd;
        padding: 10px 20px;
        font-family:Arial;
        font-size:16px;
        border: 2px solid #444;
        border-radius: 4px;
    }
    .radio-toolbar input[type="radio"]:checked + label {
        background-color:#bfb;
        border-color: #4c4;
    }
    .radio-toolbar label:hover, label {
        background-color: #dfd;
    }
</style>
<template>

  <div>
    {{taskId}}
  <br>
      <div  v-if="formFields.length">
        <div v-for="elt in formFields">
    <div v-if="elt._attributes.type === 'string'">
      <label >{{ elt._attributes.label }}</label>
      <input :id="elt._attributes.id" type="text" v-model="formValues[elt._attributes.id]"/>
    </div>

    <div v-if="elt._attributes.type === 'enum'">
      <label >{{ elt._attributes.label }}</label>
      <select :id="elt._attributes.id" v-model="formValues[elt._attributes.id]">
        <option :id="option._attributes.id" v-for="option in elt['camunda:value']" >{{option._attributes.name}}</option>
      </select>
    </div>

    <div v-if="elt._attributes.type === 'boolean'">
      <label >{{ elt._attributes.label }}</label>
      Oui <input type="radio" :id="elt._attributes.id+'_true'" :name="elt._attributes.id"  value="1" v-model="formValues[elt._attributes.id]"/>
      Non <input type="radio" :id="elt._attributes.id+'_false'" :name="elt._attributes.id"  value="0" v-model="formValues[elt._attributes.id]"/>
    </div>

    <div v-if="elt._attributes.type === 'long'">
      <label >{{ elt._attributes.label }}</label>
      <input :id="elt._attributes.id" type="text" v-model="formValues[elt._attributes.id]"/>
    </div>

    </div>
      </div>

      <div v-if="!formFields.length">

          <div v-if="formFields._attributes.type === 'string'">
            <label >{{ formFields._attributes.label }}</label>
            <input :id="formFields._attributes.id" type="text" v-model="formValues[formFields._attributes.id]"/>
          </div>

          <div v-if="formFields._attributes.type === 'enum'">
            <label >{{ formFields._attributes.label }}</label>

              <div class="radio-toolbar" v-for="option in formFields['camunda:value']">
                  <label  :for="option._attributes.id" >{{option._attributes.name}}</label>
                  <input  v-model="formValues[formFields._attributes.id]" type="radio" :id="option._attributes.id" :value="option._attributes.id" >
              </div>

          </div>

          <div v-if="formFields._attributes.type === 'boolean'">
            <label >{{ formFields._attributes.label }}</label>
            Oui <input type="radio" :id="formFields._attributes.id+'_true'" :name="formFields._attributes.id"  value="true" v-model="formValues[formFields._attributes.id]"/>
            Non <input type="radio" :id="formFields._attributes.id+'_false'" :name="formFields._attributes.id"  value="false" v-model="formValues[formFields._attributes.id]"/>
          </div>

          <div v-if="formFields._attributes.type === 'long'">
            <label >{{ formFields._attributes.label }}</label>
            <input :id="formFields._attributes.id" type="text" v-model="formValues[formFields._attributes.id]"/>
          </div>
      </div>

      <input value="Valider" type="button" v-on:click="submit"/>
  </div>

</template>

<script>
import CamundaRest from '../../../services/camunda-rest';
import DataTransformation from '../../../utils/data-transformation';

  export default {
      props: ['jsonForm','taskId'],
      data() {
          return {
              formFields : this.jsonForm["bpmn:extensionElements"]["camunda:formData"]["camunda:formField"],
              formValues : {}
          }
      },
      methods: {
          submit: function () {

              const variables = DataTransformation.generateVariablesFromFormFields(this.formValues);
              CamundaRest.postCompleteTask(this.taskId, variables).then((result) => {

                  if (result.status === 200 || result.status === 204) {
                      this.COMPLETED = true;
                      this.$router.push({ path: '/tasklist/' });
                  }
              });
          }
      },
      watch: {

          jsonForm : function(val) {
              this.formFields = val["bpmn:extensionElements"]["camunda:formData"]["camunda:formField"]
          }
      }

  }
</script>
