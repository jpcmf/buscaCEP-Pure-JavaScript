;(function(DOM) {
  'use strict';

  function app() {
    var $formCEP = new DOM('[data-js="formCEP"]');
    var $inputCEP = new DOM('[data-js="inputCEP"]');
    var $consultaCEP = new DOM('[data-js="consultaCEP"]');
    var $address = new DOM('[data-js="logradouro"]');
    var $district = new DOM('[data-js="bairro"]');
    var $state = new DOM('[data-js="estado"]');
    var $city = new DOM('[data-js="cidade"]');
    var $cep = new DOM('[data-js="cep"]');
    var $status = new DOM('[data-js="status"]');
    var $infos = new DOM('[data-js="results"]');
    var ajax = new XMLHttpRequest();
    $formCEP.on('submit', handleSubmitFormCEP);

    function handleSubmitFormCEP(e) {
      e.preventDefault();
      var url = getUrl();
      ajax.open('GET', url);
      ajax.send();
      getMessage('loading');
      ajax.addEventListener('readystatechange', handleReadyStateChange);
    }

    function getUrl() {
      return 'https://apps.widenet.com.br/busca-cep/api/cep.json?' + 'code=' + $inputCEP.get()[0].value;
    }

    function handleReadyStateChange() {
      if(isRequestOk()) {
        getMessage('ok');
        fillCEPFields();
        $infos.get()[0].classList.remove('hidden');
      }
    }

    function isRequestOk() {
      return ajax.readyState === 4 && ajax.status === 200;
    }

    function fillCEPFields() {
      var data = parseData();
      if(data.status === 0) {
        getMessage('error');
        data = clearData();
        // return;
      }
      $address.get()[0].textContent = data.address;
      $district.get()[0].textContent = data.district;
      $state.get()[0].textContent = data.state;
      $city.get()[0].textContent = data.city;
      $cep.get()[0].textContent = data.code;
      // $status.get()[0].textContent = data.message;
    }

    function clearData() {
      return {
        address: ' -',
        district: ' -',
        state: ' -',
        city: ' -',
        code: ' -'
      }
    }

    function parseData() {
      var result;
      try {
        result = JSON.parse(ajax.responseText);
      }
      catch(e) {
        result = null;
      }
      return result;
    }

    function getMessage(type) {
      var messages = {
        loading: replaceCEP('Buscando informações para o CEP [CEP]...'),
        ok: replaceCEP('Endereço referente ao CEP [CEP]:'),
        error: replaceCEP('Não encontramos o endereço para o CEP [CEP].')
      };
      $status.get()[0].textContent = messages[type];
      if(type === 'error') {
        $status.get()[0].classList.add('error');
      } else {
        $status.get()[0].classList.remove('error');
      }
      console.log(typeof type);
    }

    function replaceCEP(message) {
      var cep = $inputCEP.get()[0].value;
      return message.replace('[CEP]', cep);
    }

    return {
      init: function() {
        this.initEvents();
      },

      initEvents: function initEvents() {
        $infos.get()[0].classList.add('hidden');
        $inputCEP.forEach(function(item) {
          item.addEventListener('input', function(e) {
            item = e.target.value.length == 0 ? $consultaCEP.get()[0].disabled = true : $consultaCEP.get()[0].disabled = false;
          });
        });
      }
    }
  }

  window.app = app;
  app().init();

})(window.DOM);
