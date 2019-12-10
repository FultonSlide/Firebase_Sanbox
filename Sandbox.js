const list = document.querySelector('ul');
const form = document.querySelector('form');
const button = document.querySelector('button');

const addRecipe = (recipe, id) => {

    let time = null;

    if(recipe['created at']){
        time = recipe['created at'].toDate();
    } else {
        time = recipe.created_at.toDate();
    }
    
    let html = `
        <li data-id="${id}">
            <div>${recipe.title}</div>
            <div>${time}</div>
            <button class="btn btn-danger btn-sm my-2">delete</button>
        </li>
    `;
    list.innerHTML += html;
};

const deleteRecipe = (id) => {
    const recipes = document.querySelectorAll('li');
    recipes.forEach((recipe) => {
        if(recipe.getAttribute('data-id') === id){
            recipe.remove();
        }
    });
}

list.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON'){
        const id = e.target.parentElement.getAttribute('data-id');
        db.collection('recipes').doc(id).delete().then(() => {
            console.log('recipe deleted');
        }).catch((err) => {
            console.log(err);
        });
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const now = new Date();
    const recipe = {
        title: e.target.recipe.value.trim(),
        created_at: firebase.firestore.Timestamp.fromDate(now)
    };

    db.collection('recipes').add(recipe).then(() => {
        console.log('recipe added');
    }).catch(err => console.log(err));

    form.reset();
});

//Get documents
const unsub = db.collection('recipes').onSnapshot(snapshot => {
    snapshot.docChanges().forEach((change) => {
        const doc = change.doc;
        if(change.type === 'added'){
            addRecipe(doc.data(), doc.id);
        } else if(change.type === 'removed'){
            deleteRecipe(doc.id);
        }
    });
});

//Unsub from database changes
button.addEventListener('click', (e) => {
    unsub();
    console.log('unsubscribed from collection changes');
});