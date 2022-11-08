class Inventory {
  constructor(data){
    this.data = data;
  }

  contains(idObject) {
    return this.data.some(({id}) => id===idObject)
  }
  add(inventoryObject) {
    this.data.push(inventoryObject);
  }

  get(idObject) {
    return this.data.find(({id}) => id===idObject)
  }
};

exports.Inventory = Inventory;
