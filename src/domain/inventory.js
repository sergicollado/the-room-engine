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

  const getContentDescription = () => {
    return data.map(({smallDescription}) => smallDescription).join(", ");
  }
  return {
    contains,
    add,
    get,
    getContentDescription
  }
};

exports.Inventory = Inventory;
