const stores = ['ideale-cart'];
const version = 2;
const dbName = 'idealedb';

let dbConnection = null;
let closeConn = null;

export class ConnectionFactory {
    constructor() {
        throw new Error('Cannot create a instance of ConnectionFactory');
    }

    static getConnection() {
            return new Promise((resolve, reject) => {
                let openRequest = window.indexedDB.open(dbName, version);

                openRequest.onupgradeneeded = e => {
                    ConnectionFactory._createStores(e.target['result']);
                };

                openRequest.onsuccess = e => {
                    if (!dbConnection){
                        dbConnection = e.target['result'];
                        // Monkey Patch
                        closeConn = dbConnection.close.bind(dbConnection);
                        dbConnection.close = function() {
                            throw new Error('Você não pode fechar diretamente a conexão');
                        };
                    }
                    resolve(dbConnection);

                };

                openRequest.onerror = e => {
                    console.log(e.target['error']);
                    reject(e.target['error'].name);
                };

            });
        }

        static _createStores(connection) {
            stores.forEach(store => {
                if (connection.objectStoreNames.contains(store)) {
                    connection.deleteObjectStore(store);
                }

                connection.createObjectStore(store, { autoIncrement: true });
            });
        }

        static closeConnection(){
            if(dbConnection){
                close();
                dbConnection = null;
            }
        }
}
