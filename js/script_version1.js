const addClientes = document.querySelector('#addClientes');
const cad = document.querySelector('.cad');
const container = document.querySelector('.container');
const inputs = document.querySelectorAll('input');
const titleCad = document.querySelector('.titleCad');


//MODAL
const containerModal = document.querySelector('.container-modal');
const containerModalTittle = document.querySelector('.container-modal h2');
const salvar = document.querySelector('#salvar');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');

const tempClient = {
    nome: 'Leandro',
    email: 'leandro@gmail.com',
    celular: '09009228838',
    cidade: 'osasco'
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

// CRUD - create read update delete
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
    
    if( dbClient.length == 0 ){
        titleCad.classList.add('hide');
        window.location.reload(true);
    }
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage(dbClient)             
}

const isValidFields = () => {
    const formId = document.querySelector('#formId');
    return formId.reportValidity();
}

const clearFields = () => {
    const fields = document.querySelectorAll('.input-fields');
    fields.forEach(field => {
        field.value = '';
    })
}

const saveClient = (e) => {
    e.preventDefault();

    if(isValidFields()){

        const client = {
            nome: document.querySelector('#nome').value,
            email: document.querySelector('#email').value,
            celular: document.querySelector('#celular').value,
            cidade: document.querySelector('#cidade').value
        }
        const index = document.querySelector('#nome').dataset.index;
        if(index == 'new'){
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

const openModal = () => {
    modal.classList.remove('hide');
    setTimeout( () => {
        containerModal.classList.remove('hide');        
    },10);
}

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
            <button type="button" class="btn btn-excluir" data-id="delete-${index}">Excluir</button>
        </span>
    `
    cad.classList.remove('hide');
    container.appendChild(newRow);
 
}

const clearRows = () => {
    const rows = document.querySelectorAll('.lineCad');
    rows.forEach(row =>{
        row.parentNode.removeChild(row);
    })
}

const updateDados = () => {
    const dbClient = readClient();
    clearRows();
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.querySelector('#nome').value = client.nome
    document.querySelector('#email').value = client.email
    document.querySelector('#celular').value = client.celular
    document.querySelector('#cidade').value = client.cidade
    document.querySelector('#nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index;
    
    fillFields(client);
    openModal();
}

const editDelete = (e) => {
    if(e.target.type == 'button'){
        const [action, index] = e.target.dataset.id.split('-');

        if( action == 'edit' ){
            editClient(index);
        }else{
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if(response){
                deleteClient(index);                
                updateDados();
            }
        }
    }
}

updateDados();

//Fechar modal
const closeModal = () => {
    clearFields();
    containerModal.classList.add('hide');
    setTimeout( () => {
        modal.classList.add('hide');
    },10);
}

container.addEventListener('click', editDelete);

