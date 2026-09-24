import React, { useReducer } from 'react';

const ActionTypes = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEMS_AFTER: 'REMOVE_ITEMS_AFTER',
  CLEAR_LIST: 'CLEAR_LIST',
  UPDATE_ITEM: 'UPDATE_ITEM'
};


const initialState = {
  items: []
};

// Reducer function
const listReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADD_ITEM: {
      const { item_id, label } = action.payload;
      
      // Check if item_id already exists
      const existingItem = state.items.find(item => item.item_id === item_id);
      if (existingItem) {
        console.warn(`Item with id ${item_id} already exists. Use UPDATE_ITEM to modify.`);
        return state;
      }
      
      const newItem = {
        item_id,
        label
      };
      
      return {
        ...state,
        items: [...state.items, newItem]
      };
    }
    
    case ActionTypes.REMOVE_ITEMS_AFTER: {
      const { itemId } = action.payload;
      
      // Find the index of the item with the given itemId
      const itemIndex = state.items.findIndex(item => item.item_id === itemId);
      
      if (itemIndex === -1) {
        console.warn(`Item with id ${itemId} not found`);
        return state;
      }
      
      // Keep items up to and including the specified item
      const newItems = state.items.slice(0, itemIndex + 1);
      
      return {
        ...state,
        items: newItems
      };
    }
    
    case ActionTypes.UPDATE_ITEM: {
      const { item_id, label } = action.payload;
      
      const itemIndex = state.items.findIndex(item => item.item_id === item_id);
      
      if (itemIndex === -1) {
        console.warn(`Item with id ${item_id} not found. Use ADD_ITEM to add new item.`);
        return state;
      }
      
      const updatedItems = [...state.items];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], label };
      
      return {
        ...state,
        items: updatedItems
      };
    }
    
    case ActionTypes.CLEAR_LIST: {
      return {
        ...state,
        items: []
      };
    }
    
    default:
      return state;
  }
};

// Custom hook for the list functionality
const useListReducer = () => {
  const [state, dispatch] = useReducer(listReducer, initialState);
  
  // Action creators
  const addItem = (item_id, label) => {
    if (!item_id || !label) {
      console.error('Both item_id and label are required');
      return;
    }
    
    dispatch({
      type: ActionTypes.ADD_ITEM,
      payload: { item_id, label }
    });
  };
  
  const updateItem = (item_id, label) => {
    if (!item_id || !label) {
      console.error('Both item_id and label are required');
      return;
    }
    
    dispatch({
      type: ActionTypes.UPDATE_ITEM,
      payload: { item_id, label }
    });
  };
  
  const removeItemsAfter = (itemId) => {
    if (!itemId) {
      console.error('itemId is required');
      return;
    }
    
    dispatch({
      type: ActionTypes.REMOVE_ITEMS_AFTER,
      payload: { itemId }
    });
  };
  
  const clearList = () => {
    dispatch({ type: ActionTypes.CLEAR_LIST });
  };
  
  // Helper function to get item_id by label (returns first match)
  const getItemIdByLabel = (label) => {
    const item = state.items.find(item => item.label === label);
    return item ? item.item_id : null;
  };
  
  // Helper function to get all item_ids with a specific label
  const getItemIdsByLabel = (label) => {
    return state.items
      .filter(item => item.label === label)
      .map(item => item.item_id);
  };
  
  // Helper function to get label by item_id
  const getLabelByItemId = (item_id) => {
    const item = state.items.find(item => item.item_id === item_id);
    return item ? item.label : null;
  };
  
  // Helper function to check if item_id exists
  const itemExists = (item_id) => {
    return state.items.some(item => item.item_id === item_id);
  };
  
  // Helper function to get all items
  const getAllItems = () => {
    return state.items;
  };
  
  return {
    state,
    items: state.items,
    addItem,
    updateItem,
    removeItemsAfter,
    clearList,
    getItemIdByLabel,
    getItemIdsByLabel,
    getLabelByItemId,
    itemExists,
    getAllItems
  };
};

export default useListReducer


// Component Example
// const ListManager = () => {
//   const { 
//     state, 
//     addItem, 
//     updateItem,
//     removeItemsAfter, 
//     clearList, 
//     getItemIdByLabel,
//     getItemIdsByLabel,
//     getLabelByItemId,
//     itemExists
//   } = useListReducer();
  
//   const [newItemId, setNewItemId] = React.useState('');
//   const [newLabel, setNewLabel] = React.useState('');
//   const [searchLabel, setSearchLabel] = React.useState('');
//   const [searchResult, setSearchResult] = React.useState('');
//   const [removeItemId, setRemoveItemId] = React.useState('');
//   const [updateItemId, setUpdateItemId] = React.useState('');
//   const [updateLabel, setUpdateLabel] = React.useState('');
//   const [searchByItemId, setSearchByItemId] = React.useState('');
//   const [searchByItemIdResult, setSearchByItemIdResult] = React.useState('');
  
//   const handleAddItem = () => {
//     if (newItemId.trim() && newLabel.trim()) {
//       if (itemExists(newItemId.trim())) {
//         alert(`Item with id ${newItemId.trim()} already exists!`);
//         return;
//       }
//       addItem(newItemId.trim(), newLabel.trim());
//       setNewItemId('');
//       setNewLabel('');
//     } else {
//       alert('Both ID and Label are required!');
//     }
//   };
  
//   const handleUpdateItem = () => {
//     if (updateItemId.trim() && updateLabel.trim()) {
//       if (!itemExists(updateItemId.trim())) {
//         alert(`Item with id ${updateItemId.trim()} does not exist!`);
//         return;
//       }
//       updateItem(updateItemId.trim(), updateLabel.trim());
//       setUpdateItemId('');
//       setUpdateLabel('');
//     } else {
//       alert('Both ID and Label are required!');
//     }
//   };
  
//   const handleSearch = () => {
//     const itemId = getItemIdByLabel(searchLabel);
//     if (itemId) {
//       setSearchResult(`Found first item_id: ${itemId}`);
//     } else {
//       setSearchResult('No item found with that label');
//     }
//   };
  
//   const handleSearchByItemId = () => {
//     const label = getLabelByItemId(searchByItemId);
//     if (label) {
//       setSearchByItemIdResult(`Found label: ${label}`);
//     } else {
//       setSearchByItemIdResult('No item found with that ID');
//     }
//   };
  
//   const handleRemoveAfter = () => {
//     if (removeItemId.trim()) {
//       if (!itemExists(removeItemId.trim())) {
//         alert(`Item with id ${removeItemId.trim()} does not exist!`);
//         return;
//       }
//       removeItemsAfter(removeItemId.trim());
//       setRemoveItemId('');
//     }
//   };
  
//   const handleSearchAll = () => {
//     const itemIds = getItemIdsByLabel(searchLabel);
//     if (itemIds.length > 0) {
//       setSearchResult(`Found ${itemIds.length} item(s) with IDs: ${itemIds.join(', ')}`);
//     } else {
//       setSearchResult('No items found with that label');
//     }
//   };
  
//   // Example: Initialize with some data
//   const initializeSampleData = () => {
//     clearList();
//     addItem('item1', 'Apple');
//     addItem('item2', 'Banana');
//     addItem('item3', 'Cherry');
//     addItem('item4', 'Date');
//     addItem('item5', 'Elderberry');
//     addItem('item6', 'Fig');
//     addItem('item7', 'Grape');
//     alert('Sample data initialized!');
//   };
  
//   return (
//     <div style={{ padding: '20px', maxWidth: '800px' }}>
//       <h2>List Manager (Custom ID Support)</h2>
      
//       {/* Initialize Sample Data */}
//       <div style={{ marginBottom: '20px' }}>
//         <button onClick={initializeSampleData} style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
//           Initialize Sample Data
//         </button>
//       </div>
      
//       {/* Add Item Section */}
//       <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
//         <h3>Add New Item</h3>
//         <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
//           <input
//             type="text"
//             value={newItemId}
//             onChange={(e) => setNewItemId(e.target.value)}
//             placeholder="Enter custom item_id"
//             style={{ flex: 1, padding: '8px' }}
//           />
//           <input
//             type="text"
//             value={newLabel}
//             onChange={(e) => setNewLabel(e.target.value)}
//             placeholder="Enter label"
//             style={{ flex: 1, padding: '8px' }}
//           />
//         </div>
//         <button onClick={handleAddItem} style={{ padding: '8px 15px' }}>
//           Add Item with Custom ID
//         </button>
//         <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
//           Note: item_id must be unique. Duplicate IDs will be rejected.
//         </p>
//       </div>
      
//       {/* Update Item Section */}
//       <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f7ff', borderRadius: '5px' }}>
//         <h3>Update Item</h3>
//         <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
//           <input
//             type="text"
//             value={updateItemId}
//             onChange={(e) => setUpdateItemId(e.target.value)}
//             placeholder="Enter item_id to update"
//             style={{ flex: 1, padding: '8px' }}
//           />
//           <input
//             type="text"
//             value={updateLabel}
//             onChange={(e) => setUpdateLabel(e.target.value)}
//             placeholder="Enter new label"
//             style={{ flex: 1, padding: '8px' }}
//           />
//         </div>
//         <button onClick={handleUpdateItem} style={{ padding: '8px 15px', backgroundColor: '#ff9800', color: 'white' }}>
//           Update Item Label
//         </button>
//       </div>
      
//       {/* Search Section */}
//       <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
//         {/* Search by Label */}
//         <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
//           <h3>Search by Label</h3>
//           <input
//             type="text"
//             value={searchLabel}
//             onChange={(e) => setSearchLabel(e.target.value)}
//             placeholder="Enter label to search"
//             style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
//           />
//           <div style={{ display: 'flex', gap: '10px' }}>
//             <button onClick={handleSearch} style={{ flex: 1, padding: '8px' }}>
//               Find First
//             </button>
//             <button onClick={handleSearchAll} style={{ flex: 1, padding: '8px' }}>
//               Find All
//             </button>
//           </div>
//           <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e9ecef' }}>
//             {searchResult}
//           </div>
//         </div>
        
//         {/* Search by Item ID */}
//         <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
//           <h3>Search by Item ID</h3>
//           <input
//             type="text"
//             value={searchByItemId}
//             onChange={(e) => setSearchByItemId(e.target.value)}
//             placeholder="Enter item_id to search"
//             style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
//           />
//           <button onClick={handleSearchByItemId} style={{ width: '100%', padding: '8px' }}>
//             Find Label by ID
//           </button>
//           <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e9ecef' }}>
//             {searchByItemIdResult}
//           </div>
//         </div>
//       </div>
      
//       {/* Remove Items Section */}
//       <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
//         <h3>Remove Items After</h3>
//         <input
//           type="text"
//           value={removeItemId}
//           onChange={(e) => setRemoveItemId(e.target.value)}
//           placeholder="Enter item_id (items after will be removed)"
//           style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
//         />
//         <button onClick={handleRemoveAfter} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white' }}>
//           Remove Items After
//         </button>
//         <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
//           Example: If items are [id1, id2, id3, id4, id5] and you enter id3, items id4 and id5 will be removed
//         </p>
//       </div>
      
//       {/* Current List Display */}
//       <div style={{ marginBottom: '20px' }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
//           <h3>Current List ({state.items.length} items)</h3>
//           <button onClick={clearList} style={{ padding: '8px 15px', backgroundColor: '#6c757d', color: 'white' }}>
//             Clear All Items
//           </button>
//         </div>
        
//         {state.items.length === 0 ? (
//           <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f8f9fa', color: '#6c757d' }}>
//             No items in the list. Add some items to get started.
//           </div>
//         ) : (
//           <div style={{ border: '1px solid #dee2e6', borderRadius: '5px' }}>
//             <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 1fr', padding: '10px', backgroundColor: '#e9ecef', fontWeight: 'bold' }}>
//               <div>#</div>
//               <div>item_id</div>
//               <div>Label</div>
//               <div>Actions</div>
//             </div>
//             {state.items.map((item, index) => (
//               <div 
//                 key={item.item_id} 
//                 style={{ 
//                   display: 'grid',
//                   gridTemplateColumns: '50px 1fr 1fr 1fr',
//                   padding: '10px',
//                   borderTop: '1px solid #dee2e6',
//                   backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa'
//                 }}
//               >
//                 <div>{index + 1}</div>
//                 <div>
//                   <code style={{ backgroundColor: '#e9ecef', padding: '2px 5px', borderRadius: '3px' }}>
//                     {item.item_id}
//                   </code>
//                 </div>
//                 <div>{item.label}</div>
//                 <div>
//                   <button 
//                     onClick={() => {
//                       setRemoveItemId(item.item_id);
//                     }}
//                     style={{ 
//                       padding: '3px 8px', 
//                       fontSize: '12px',
//                       backgroundColor: '#ffc107',
//                       border: 'none',
//                       borderRadius: '3px',
//                       marginRight: '5px'
//                     }}
//                   >
//                     Remove After
//                   </button>
//                   <button 
//                     onClick={() => {
//                       setUpdateItemId(item.item_id);
//                       setUpdateLabel(item.label);
//                     }}
//                     style={{ 
//                       padding: '3px 8px', 
//                       fontSize: '12px',
//                       backgroundColor: '#17a2b8',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '3px'
//                     }}
//                   >
//                     Edit
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
      
//       {/* Debug Info */}
//       <details>
//         <summary style={{ cursor: 'pointer', padding: '10px', backgroundColor: '#6c757d', color: 'white' }}>
//           Debug Information (JSON View)
//         </summary>
//         <pre style={{ 
//           margin: 0, 
//           padding: '15px', 
//           backgroundColor: '#343a40', 
//           color: '#f8f9fa',
//           fontSize: '12px',
//           maxHeight: '300px',
//           overflow: 'auto'
//         }}>
//           {JSON.stringify(state.items, null, 2)}
//         </pre>
//       </details>
//     </div>
//   );
// };

// export default ListManager;