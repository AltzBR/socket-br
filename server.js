// Realiza o require do express, http, e socketio
let app = require('express')();

// passa o express para o http-server
let http = require('http').Server(app);

// passa o http-server par ao socketio
let io = require('socket.io')(http);

// inicia o servidor na porta informada, no caso vamo iniciar na porta 3000
let porta = process.env.PORT || 3000

if(porta === 3000) {
  io.set('origins', [
    'br:*',
    'ofc.forcasarmadasbrhb.net:*',
    'pracas.forcasarmadasbrhb.net:*',
  ]);
} else {
  //io.set('origins', [
  //  'ofc.exbrhb.net:*', 
  //  'pracas.exbrhb.net:*', 
  //]);
}

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

let onlines = {}

// sempre que o socketio receber uma conexão vai devoltar realizar o broadcast dela
io.on('connection', socket => {
  
  socket.on('entrar_ex', usuario => {
    onlines[socket.id] = usuario;

    io.emit('online_ex', {...onlines});
  });

  socket.on('entrar_aer', usuario => {
    onlines[socket.id] = usuario;

    io.emit('online_aer', {...onlines});
  });

  socket.on('patrulhas_add_ex', patrulha => {
    io.emit('nova_patrulha_ex', patrulha);
  });

  socket.on('patrulhas_add_aer', patrulha => {
    io.emit('nova_patrulha_aer', patrulha);
  });

  socket.on('finalizarPatrulha_ex', patrulha_id => {
    io.emit('fim_patrulha_ex', patrulha_id)
  })

  socket.on('finalizarPatrulha_aer', patrulha_id => {
    io.emit('fim_patrulha_aer', patrulha_id)
  })

  socket.on('relatorio_treino_ex', relatorio => {
    io.emit('add_relatorio_ex', relatorio)
  })

  socket.on('relatorio_treino_aer', relatorio => {
    io.emit('add_relatorio_aer', relatorio)
  })

  socket.on('atualizarRelatorio_ex', relatorio => {
    io.emit('relatorio_atualizar_ex', relatorio)
  })

  socket.on('atualizarRelatorio_aer', relatorio => {
    io.emit('relatorio_atualizar_aer', relatorio)
  })

  socket.on('marcar_erro_ex', id => {
    io.emit('relatorio_errado_ex', id)
  })

  socket.on('marcar_erro_aer', id => {
    io.emit('relatorio_errado_aer', id)
  })

  socket.on('room_ex', roomName => {
    socket.join(roomName)
  })

  socket.on('room_aer', roomName => {
    socket.join(roomName)
  })

  // ! RMO Area
  socket.on('rmo_add_ex', rmoMembro => {
    io.to('ofcsuperiores').emit('novo_membrormo_ex', rmoMembro)
  })

  socket.on('rmo_add_aer', rmoMembro => {
    io.to('ofcsuperiores').emit('novo_membrormo_aer', rmoMembro)
  })

  socket.on('rmo_pegou_ex', responsavel => {
    io.to('ofcsuperiores').emit('new_responsavel_ex', responsavel)
  })

  socket.on('rmo_pegou_aer', responsavel => {
    io.to('ofcsuperiores').emit('new_responsavel_aer', responsavel)
  })

  socket.on('iniciarRMO_ex', () => {
    io.to('ofcsuperiores').emit('new_rmo_ex')
  })

  socket.on('iniciarRMO_aer', () => {
    io.to('ofcsuperiores').emit('new_rmo_aer')
  })

  socket.on('finalziarRMO_ex', () => {
    io.to('ofcsuperiores').emit('rmo_ended_ex')
  })

  socket.on('finalziarRMO_aer', () => {
    io.to('ofcsuperiores').emit('rmo_ended_aer')
  })

  socket.on('atualizar_status_ex', membro => {
    io.to('ofcsuperiores').emit('status_updateded_ex', membro)
  })

  socket.on('atualizar_status_aer', membro => {
    io.to('ofcsuperiores').emit('status_updateded_aer', membro)
  })

  // ! RM Area
  socket.on('rm_pegou_ex', responsavel => {
    io.emit('new_responsavelrm_ex', responsavel)
  })

  socket.on('rm_pegou_aer', responsavel => {
    io.emit('new_responsavelrm_aer', responsavel)
  })

  socket.on('iniciarRM_ex', () => {
    io.emit('new_rm_ex')
  })

  socket.on('iniciarRM_aer', () => {
    io.emit('new_rm_aer')
  })

  socket.on('patrulhamonitoria_ex', responsaveis => {
    io.emit('update_monitoriapatrulha_ex', responsaveis)
  })

  socket.on('patrulhamonitoria_aer', responsaveis => {
    io.emit('update_monitoriapatrulha_aer', responsaveis)
  })

  socket.on('finalziarRM_ex', () => {
    io.emit('rm_ended_ex')
  })

  socket.on('finalziarRM_aer', () => {
    io.emit('rm_ended_aer')
  })

  //io.to('some room').emit('some event');

  socket.on('disconnect', () => {    
    // remove saved socket from users object
    delete onlines[socket.id];
    io.emit('online_ex', {...onlines});
    io.emit('online_aer', {...onlines});
  });

});

http.listen(porta, function(){
  console.log('Servidor rodando em: ', porta);
});
