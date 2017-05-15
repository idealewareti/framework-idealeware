export class AppTexts{
    
    public static CART_LOAD_ERROR = 'Não foi possível obter o carrinho';
    public static CART_ADD_ERROR = 'Não foi possível adicionar o item ao carrrinho';
    public static CART_EMPTY = 'Carrinho vazio';
    public static CART_EMPTY_ERROR = 'Não foi possível esvaziar o carrinho';
    public static CART_ADD_ITEM = 'Item adicionado ao carrinho';

    public static SIGNUP_API_OFFLINE = 'Problema técnico';
    public static SIGNUP_ERROR_TITLE = 'Erro no cadastro';

    public static GENDERS = [
        {value: 'F', label: 'Feminino'},
        {value: 'M', label: 'Masculino'}
    ];

    public static BRAZILIAN_STATES = [
        {value: 'AC',label: 'Acre'},
        {value: 'AL',label: 'Alagoas'},
        {value: 'AM',label: 'Amazonas'},
        {value: 'AP',label: 'Amapá'},
        {value: 'BA',label: 'Bahia'},
        {value: 'CE',label: 'Ceará'},
        {value: 'DF',label: 'Distrito Federal'},
        {value: 'ES',label: 'Espírito Santo'},
        {value: 'GO',label: 'Goiás'},
        {value: 'MA',label: 'Maranhão'},
        {value: 'MG',label: 'Minas Gerais'},
        {value: 'MS',label: 'Mato Grosso do Sul'},
        {value: 'MT',label: 'Mato Grosso'},
        {value: 'PA',label: 'Pará'},
        {value: 'PB',label: 'Paraíba'},
        {value: 'PE',label: 'Pernambuco'},
        {value: 'PI',label: 'Piauí'},
        {value: 'PR',label: 'Paraná'},
        {value: 'RJ',label: 'Rio de Janeiro'},
        {value: 'RN',label: 'Rio Grande do Norte'},
        {value: 'RO',label: 'Rondônia'},
        {value: 'RR',label: 'Roraima'},
        {value: 'RS',label: 'Rio Grande do Sul'},
        {value: 'SC',label: 'Santa Catarina'},
        {value: 'SE',label: 'Sergipe'},
        {value: 'SP',label: 'São Paulo'},
        {value: 'TO',label: 'Tocantins'},
        {value: 'EX',label: 'Exterior'}
     ];

     public static ADDRESS_TYPES = [
         {value: '1', label: 'Residencial'},
         {value: '2', label: 'Comercial'},
     ];

     public static CUSTOMER_TYPES = [
        { value: 'F', label: 'Pessoa Física' },
        { value: 'J', label: 'Pessoa Jurídica' },
        
     ];

     public static PAYMENT_METHOD_TYPES = [
        { value: 1, label: 'Cartão de Crédito' },
        { value: 2, label: 'Boleto' },
        { value: 3, label: 'Dinheiro' },
        { value: 99, label: 'Outros' },
     ];

     public static PAYMENT_TYPES = [
        { value: 1, label: 'Online' },
        { value: 2, label: 'Offline' },
     ];
}