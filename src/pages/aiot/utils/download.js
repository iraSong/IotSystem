function download(params, url) {
  $('#downloadform').remove()
  let form = $('<form>')
  form.attr('id', 'downloadform')
  form.attr('style', 'display:none')
  form.attr('target', '_blank')
  form.attr('method', 'post')
  form.attr('action', process.env.VUE_APP_API_PATH + url)

  if (params != 'tpl') {
    let form_data = { body: JSON.stringify(params) }
    Object.keys(form_data).forEach(function(key) {
      let input = $('<input>')
      input.attr('type', 'hidden')

      input.attr('name', key)
      input.attr('value', form_data[key])
      form.append(input)
    })
  }
  $('body').append(form)
  form.submit()
}

export default download