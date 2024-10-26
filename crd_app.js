const inventoryContainer = document.getElementById("inventory-container");
let lastCreatedItem = null;

// Fetch and display inventory items
async function onFetchInventoryClick() {
  const response = await fetch("http://localhost:3000/inventory");
  const inventoryList = await response.json();
  inventoryList.reverse();
  inventoryContainer.innerHTML = inventoryList
    .map(
      (item) => `<div class="bg-light rounded mt-3">
        <h3>${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <button class="btn btn-danger" data-id="${item.id}" id="deleteButton" >Delete</button>
        </div>`
    )
    .join("");
  let deleteButton = document.getElementById("deleteButton");
  deleteButton.addEventListener("click", (e) => {
    const itemId = e.target.getAttribute("data-id");
    console.log(itemId);
    deleteItem(itemId);
  });
}

// Create a new inventory item
async function onCreateInventoryClick() {
  let newName = document.getElementById("newName").value;
  let newQty = document.getElementById("newQty").value;
  const newItem = { name: newName, quantity: newQty };
  const response = await fetch("http://localhost:3000/inventory", {
    method: "POST", // CREATE
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newItem),
  });
  const newlyCreatedItem = await response.json();
  lastCreatedItem = newlyCreatedItem;
  document.getElementById("newName").value = "";
  document.getElementById("newQty").value = "";
  // Fetch updated list
  onFetchInventoryClick();
}

// Delete item from list
async function deleteItem(id) {
  console.log("deleteItem:", id);

  await fetch(`http://localhost:3000/inventory/${id}`, {
    method: "DELETE", // DELETE
  });
  lastCreatedItem = null;

  // Fetch updated list
  onFetchInventoryClick();
}

// Fetch updated list
onFetchInventoryClick();

// Delete the last created item
async function onDeleteInventoryClick() {
  if (lastCreatedItem === null) {
    console.log("No item created yet to delete");
    return;
  }
  await fetch(`http://localhost:3000/inventory/${lastCreatedItem.id}`, {
    method: "DELETE", // DELETE
  });
  lastCreatedItem = null;
}
// Event listeners for buttons
document
  .getElementById("fetch-inventory")
  .addEventListener("click", onFetchInventoryClick);
document
  .getElementById("create-inventory")
  .addEventListener("click", onCreateInventoryClick);
document
  .getElementById("delete-inventory")
  .addEventListener("click", onDeleteInventoryClick);

// Initial fetch of inventory
onFetchInventoryClick();
