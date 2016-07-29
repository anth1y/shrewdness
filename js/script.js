"use strict"
const $ = require('jquery')
const hbars = require('handlebars')
const dialog = remote.require('dialog')
const partd = require('./lib/parted')
const mount = require('./lib/jsmnt')
const imgwrt = require('./lib/imgwrt')
const promise = require('es6-promise').Promise

function renderCheckboxes () {
    let form = $('#form')
    let source = $("#template").html()
    let template = hbars.compile(source)
    mount.list(function(err, drives) {
      if (err) {
        return console.log(err)
      }

      let html = template({
          drives : drives
      })
      form.append(html)
        $('#drvchkbox').change(function(){
            let sector = []
           $( "input:checkbox:checked" ).each(function(){
               sector.push($(this).val())
           })
           drvimgr.drives = sector
           console.log(drvimgr)
        })
    })
}
let drvimgr = { drives : [] }
function chooseImage() {
       dialog.showOpenDialog({
          filters: [
         {name: 'Images', extensions: ['dmg']},
           ]
        },
            function(filenames){
               console.log(filenames)
               drvimgr.image = filenames[0]
               console.log(drvimgr.image)
        })
}

function conf() {
    return $('#conf')[0].value
}

function partition() {
       let dsk = drvimgr.drives[0].slice(0,-2)
       partd.partitionDisk(dsk,conf())    
       console.log(dsk,conf())
}


function asr() {
    let img = drvimgr.image
    let success = function(result){
        alert('done!')
    }
    let error = function (e){
        console.log('something went wrong')
    }

    let myPromise = new promise(function(resolve, reject){
        for (let dev of drvimgr.drives){
            let temp = imgwrt.asr(img, dev, function(){})
          //  console.log('ASR', img, dev )
        }
        resolve()
    })

    myPromise.then(success, error)
}

$(function () {
    renderCheckboxes()
 })

