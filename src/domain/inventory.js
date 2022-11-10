const Inventory  = (data) => {
  const contains = (idObject) => {
    return data.some(({id}) => id===idObject)
  }

  const add = (inventoryObject) => {
    data.push(inventoryObject);
  }

  const get = (idObject) => {
    return data.find(({id}) => id===idObject)
  }

  return {
    contains,
    add,
    get
  }
};

exports.Inventory = Inventory;
