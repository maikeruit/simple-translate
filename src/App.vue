<template>
    <div id="app">
        <el-row type="flex" justify="center">
            <el-col :span="10" style="text-align: left">
                <el-select v-model="source" filterable size="mini" @change="sync">
                    <el-option v-for="lang in languages" :key="lang.value" :label="lang.label" :value="lang.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4" style="text-align: center">
                <el-button size="mini" @click="change" type="success" icon="el-icon-refresh"></el-button>
            </el-col>
            <el-col :span="10" style="text-align: right">
                <el-select size="mini" filterable v-model="target" @change="sync">
                    <el-option v-for="lang in languages" :key="lang.value" :label="lang.label" :value="lang.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>

        <hr>

        <el-form :model="ruleForm" label-position="top" ref="ruleForm">
            <el-row>
                <el-col :span="24">
                    <el-form-item :label="templateData.labelSource" prop="source">
                        <el-input tabindex="1" id="source" :placeholder="templateData.textareatPlaceholder"
                                  type="textarea" v-model.trim="ruleForm.source"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row type="flex" justify="space-between">
                <el-col :span="16">
                    <el-button @click="translate" style="width: 100%" size="mini" type="primary"
                               icon="el-icon-edit">
                        {{ templateData.translate }}
                    </el-button>
                </el-col>
                <el-col :span="7">
                    <el-button @click="clear" style="width: 100%" size="mini">
                        {{ templateData.clear }}
                    </el-button>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-form-item :label="templateData.labelTarget" prop="target">
                        <el-input type="textarea" id="target" v-model.trim="ruleForm.target"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row id="footer">
            <el-col style="font-size: 12px;" :span="12">
                &copy; 2017 "Simple Translation"
            </el-col>
            <el-col :span="12" style="font-size: 12px; text-align: right">
                Open Source Project - <a target="_blank" href="https://github.com/kamaliev/simple-translate">GitHub</a>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  import {API_KEY} from './config'

  export default {
    name: 'app',
    data () {
      return {
        ruleForm: {
          source: '',
          target: ''
        },
        templateData: {
          textareatPlaceholder: window.chrome.i18n.getMessage('textareatPlaceholder'),
          translate: window.chrome.i18n.getMessage('translate'),
          clear: window.chrome.i18n.getMessage('clear'),
          labelSource: window.chrome.i18n.getMessage('labelSource'),
          labelTarget: window.chrome.i18n.getMessage('labelTarget')
        },
        languages: [
          {
            value: 'en',
            label: window.chrome.i18n.getMessage('english')
          },
          {
            value: 'ru',
            label: window.chrome.i18n.getMessage('russian')
          },
          {
            value: 'de',
            label: window.chrome.i18n.getMessage('german')
          }
        ],
        source: 'en',
        target: 'ru'
      }
    },
    mounted: function () {
      if (process.env.NODE_ENV === 'production') {
        let _this = this

        window.chrome.storage.sync.get(['source', 'target'], function (items) {
          if (items.source && items.target) {
            _this.source = items.source
            _this.target = items.target
          }

          _this.pasteAndTranslate()
        })
      }
    },
    methods: {
      translate: function () {
        let _this = this
        let data = {
          'q': this.ruleForm.source,
          'source': this.source,
          'target': this.target,
          'key': API_KEY,
          'format': 'text',
          'model': 'nmt'
        }
        if (this.ruleForm.source) {
          axios
            .post('https://translation.googleapis.com/language/translate/v2', qs.stringify(data))
            .then(function ({data}) {
              _this.ruleForm.target = data.data.translations[0].translatedText
            })
            .catch(function (response) {
              _this.$message.error(window.chrome.i18n.getMessage('apiError'))
            })
        }
      },
      clear: function () {
        this.$refs.ruleForm.resetFields()
      },
      change: function () {
        let gap = this.target
        this.target = this.source
        this.source = gap

        this.sync()
      },
      sync: function () {
        if (process.env.NODE_ENV === 'production') {
          let _this = this

          window.chrome.storage.sync.set({
            source: _this.source,
            target: _this.target
          })
        }
      },
      pasteAndTranslate: function () {
        let _this = this

        window.chrome.tabs.executeScript({
          code: 'window.getSelection().toString();'
        }, function (selection) {
          _this.ruleForm.source = selection[0]
          _this.translate()
        })
      }
    }
  }
</script>
