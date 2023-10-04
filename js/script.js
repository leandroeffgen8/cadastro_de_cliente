const container = document.querySelector('.container');
const cad = document.querySelector('.cad');
const salvar = document.querySelector('#salvar');
const titleCad = document.querySelector('.titleCad');

//MODAL
const modal = document.querySelector('.modal');
const containerModal = document.querySelector('.container-modal');
const containerModalTitle = document.querySelector('.container-modal h2');

//FUNCÃO QUE ARMAZENA DADOS NO LOCALSTORAGE
const getLocalStorage = () => JSON.parse(localStorage.getItem('cadastro')) ?? []
const setLocalStogare = (dbClient) => localStorage.setItem('cadastro', JSON.stringify(dbClient))

//CREATE - ADICIONA DADOS NO LOCALSTORAGE
const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStogare(dbClient)
}

//UPDATE - ATUALIZA DOS DADOS NO LOCALSTORAGE
const updateClient = (index, client) => {
    const dbClient = getLocalStorage();
    dbClient[index] = client;
    setLocalStogare(dbClient);
}

//DELETE - DELETA OS DADOS DO LOCALSTORAGE
const deleteClient = (index) => {
    const dbClient = getLocalStorage();
    dbClient.splice(index, 1)
    setLocalStogare(dbClient);

    if( dbClient.length == 0 ){
        titleCad.classList.add('hide');
        window.location.reload(true);
    }
}

const isValidFields = () => {
    const form = document.querySelector('#formId');
    return form.reportValidity();
}

const saveClient = (e) => {
    e.preventDefault();

    if( isValidFields() ){
        const client = {
            nome: document.querySelector('#nome').value,
            email: document.querySelector('#email').value,
            celular: document.querySelector('#celular').value,
            cidade: document.querySelector('#cidade').value
        }
    
        const index = document.querySelector('#nome').dataset.index;
        if( index == 'new' ){
            createClient(client); 
            updateDados();
            closeModal();
        }else{
            updateClient(index, client); 
            updateDados();
            closeModal(); 
        }
    }
    
}

salvar.addEventListener('click', saveClient);

//LIMPA O CAMPO DE FORMULARIO DE CADASTRO DE CLIENTE ASSIM QUE FOR PREENCHIDO
const clearFields = () => {
    const fields = document.querySelectorAll('.input-fields');

    fields.forEach(field => {
        field.value = '';
    });
}

//MONTA O HTML COM OS DADOS CADASTRADOS
const createRow = (client, index) => {
    const newRow = document.createElement('div');
    newRow.classList.add('lineCad');
    
    newRow.innerHTML = `
        <span class="nome">${client.nome}</span>
        <span class="email">${client.email}</span>
        <span class="celular">${client.celular}</span>
        <span class="cidade">${client.cidade}</span>
        <span class="btns-containers">
            <button type="button" class="btn btn-editar" data-id="edit-${index}">Editar</button>
            <button type="button" class="btn btn-excluir" data-id="exclude-${index}">Excluir</button>
        </span>
    `;
    cad.classList.remove('hide');
    container.appendChild(newRow);
}

//LIMPA O HTML ANTES DE INCLUIR UMA NOVA LINHA
const clearRows = () => {
    const rows = document.querySelectorAll('.lineCad');
    rows.forEach(row => {
        row.parentNode.removeChild(row);
    })
}

//FUNÇÃO QUE ATUALIZA A TELA DE CADASTRO
const updateDados = () => {
    const dbClient = getLocalStorage();
    clearRows(); 
    dbClient.forEach(createRow);
}

//DADOS PREECHIDOS A SEREM EDITADOS
const fillFields = (client) => {
    document.querySelector('#nome').value = client.nome
    document.querySelector('#email').value = client.email
    document.querySelector('#celular').value = client.celular
    document.querySelector('#cidade').value = client.cidade
    document.querySelector('#nome').dataset.index = client.index
}

//EDITAR CLIENTE
const editClient = (index) => {
    const client = getLocalStorage()[index]
    client.index = index;
    fillFields(client);
    openModal();
    
}

//EDITAR E DELETAR CADASTRO
const editDelet = (e) => {
    if( e.target.type == 'button' ){
        const [action, index] = e.target.dataset.id.split('-');
       
        if( action == 'edit' ){  
            containerModal.classList.add('editar');                  
            editClient(index);
        }else{
            const client = getLocalStorage()[index]
            Swal.fire({
                title: 'Excluir cadastro?',
                html: `Você excluirá o cadastro <strong><u>${client.nome}</u></strong>!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#08b3dd',
                cancelButtonColor: '#333',
                confirmButtonText: 'Sim, deletar!'
                }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: "Deletado",
                        text: 'Seu cadastro foi deletado com sucesso!'
                    }).then( () => {
                        deleteClient(index);
                        updateDados();
                    });  
                } 
            });
        }
    }
}

updateDados();

container.addEventListener('click', editDelet);

//ALTERA O LABEL QUANDO ESTIVER EDITANDO OU SALVANDO CADASTRO
const changeText = () => {
    if( containerModal.classList.contains('editar') ){
        containerModalTitle.textContent = 'Editar Cliente';
        salvar.textContent = 'Editar'
        containerModal.classList.remove('editar');
    }else{
        containerModalTitle.textContent = 'Novo Cliente'
        salvar.textContent = 'Salvar'
    } 
}

//ABRE MOODAL
const openModal = () => {
    modal.classList.remove('hide');
    containerModal.classList.remove('hide'); 
    changeText();    
}

//FECHA MODAL
const closeModal = () => { 
    clearFields();   
    containerModal.classList.add('hide');
    modal.classList.add('hide');
}