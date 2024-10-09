const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js');
const client = new Client();

// serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// após isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Inicializa tudo
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Funil

const contatosPorLoja = {
    'Palmas': {
        'comercial': '👤 *Vendedores Palmas:*\n\nEvania\n +55 63 8453-3618\n\nGlaucilane\n +55 63 8456-7199\n\nIago\n +55 63 8456-5940\n\nVitoria\n +55 63 9245-2567\n\nManoel\n +55 63 9257-8159\n\nDiogo\n +55 63 8453-6266',
        'financeiro': '👤 *Financeiro Palmas:*\n\nFinanceiro\n +55 63 8454-4708'
    },
    'Araguaína': {
        'comercial': '👤 *Vendedores Araguaína:*\n\nAntonio\n +55 63 9277-8886\n\nEdpo\n +55 63 9234-5717\n\nJessica\n +55 63 9102-9185\n\nDaniele\n +55 63 9102-9940',
        'financeiro': '👤 *Financeiro Araguaína:*\n\nFinanceiro\n +55 63 9102-7885'
    },
    'Gurupi': {
        'comercial': '👤 *Vendedores Gurupi:*\n\nRaquel\n +55 63 9295-7918\n\nZé Ricardo\n +55 63 9295-7840',
        'financeiro': '👤 *Financeiro Gurupi:*\n\nFinanceiro\n +55 63 9295-3292'
    },
    'Imperatriz': {
        'comercial': '👤 *Vendedores Imperatriz:*\n\nMiguel\n +55 99 8507-7025\n\nBruna\n +55 99 8507-6973\n\nAdson\n +55 99 8507-6993\n\nMorgana\n +55 99 8507-6950\n\nWillamy\n +55 99 9143-0388',
        'financeiro': '👤 *Financeiro Imperatriz:*\n\nFinanceiro\n +55 99 8154-2859'
    },
    'São Luís': {
        'comercial': '👤 *Vendedores São Luís:*\n\nNagila\n +55 98 8403-1242\n\nJessica\n +55 98 8402-6545',
        'financeiro': '👤 *Financeiro São Luís:*\n\nFinanceiro\n +55 98 7007-6114'
    }
};

// Objeto para armazenar o estado da conversa de cada usuário
const userStates = {}; 

client.on('message', async msg => {
    const chatId = msg.from;

    // Inicializar o estado do usuário se não existir
    if (!userStates[chatId]) {
        userStates[chatId] = 'inicio'; // Estado inicial
    }

    const currentState = userStates[chatId]; // Pegar o estado atual

    // Se estiver no estado 'inicio' e receber 'menu' ou 'teste'
    if (currentState === 'inicio' && msg.body.match(/(menu|teste)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000); 
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname;
        await client.sendMessage(msg.from, `👤 Olá, ${name.split(" ")[0]}! Sou o *assistente virtual* da Digisat Distribuidora.\n\n Com qual loja você deseja falar? \n\n_digite uma das opções abaixo:_\n\n*1* - Palmas\n*2* - Araguaína\n*3* - Gurupi\n*4* - Imperatriz\n*5* - São Luís\n*6* - Compras\n*7* - Suporte Técnico\n*8* - Qualidade\n*9* - Suporte Site\n*10* - Redes sociais`);

        // Atualiza o estado para aguardar a escolha da loja
        userStates[chatId] = 'escolhendo-loja'; 
        return;
    }

    // Se o estado for 'escolhendo-loja'
    if (currentState === 'escolhendo-loja') {
        let lojaEscolhida = '';
        switch (msg.body) {
            case '1':
                lojaEscolhida = 'Palmas';
                break;
            case '2':
                lojaEscolhida = 'Araguaína';
                break;
            case '3':
                lojaEscolhida = 'Gurupi';
                break;
            case '4':
                lojaEscolhida = 'Imperatriz';
                break;
            case '5':
                lojaEscolhida = 'São Luís';
                break;
            case '6':
                lojaEscolhida = 'Compras';
                await delay(3000);
                await client.sendMessage(msg.from, `👤 ${lojaEscolhida}:\n\nLucas Alencar \n +55 63 9126-0181 \n\n Lucas Borges \n +55 63 9126-1158`);
                await delay(3000);
                await client.sendMessage(msg.from, '_Sessão finalizada. Digite (Menu) para iniciar novamente._');
                userStates[chatId] = 'inicio';
                break;
            case '7':
                lojaEscolhida = 'Suporte técnico';
                await delay(3000);
                await client.sendMessage(msg.from, `👤 ${lojaEscolhida}:\n\nAssitência \n +55 63 8456-5749 \n\n Nandin \n +55 63 8458-2000\n\nJean \n +55 63 8449-5697`);
                await delay(3000);
                await client.sendMessage(msg.from, '_Sessão finalizada. Digite (Menu) para iniciar novamente._');
            
                // Reseta o estado do usuário para 'inicio'
                userStates[chatId] = 'inicio';
                break;
            case '8':
                lojaEscolhida = 'Qualidade';
                await delay(3000);
                await client.sendMessage(msg.from, `👤 ${lojaEscolhida}:\n +55 63 9252-9448`);
                await delay(3000);
                await client.sendMessage(msg.from, '_Sessão finalizada. Digite (Menu) para iniciar novamente._');
            
                // Reseta o estado do usuário para 'inicio'
                userStates[chatId] = 'inicio';
                break;
            case '9':
                await delay(3000);
                await client.sendMessage(msg.from, `👤 Suporte Site:\n +55 63 8456-7272`);
                await delay(3000);
                await client.sendMessage(msg.from, '_Sessão finalizada. Digite (Menu) para iniciar novamente._');
            
                // Reseta o estado do usuário para 'inicio'
                userStates[chatId] = 'inicio';
                break;
            case '10':
                await delay(3000);
                await client.sendMessage(msg.from, `👤 Redes Sociais:\n\nInstagram \n instagram.com/digisatdistribuidora/\n\nFacebook \n facebook.com/DigisatDistribuidora \n\nYoutube \n youtube.com/DigisatDistribuidora \n\nTiktok \n tiktok.com/@digisatdistribuidora \n\nLinkedin \n br.linkedin.com/company/digisat-distribuidora`);
                await delay(3000);
                await client.sendMessage(msg.from, '_Sessão finalizada. Digite (Menu) para iniciar novamente._');
            
                // Reseta o estado do usuário para 'inicio'
                userStates[chatId] = 'inicio';
                break;
            default:
                await client.sendMessage(msg.from, ' _*Opção inválida*. Por favor, escolha uma das opções válidas_');
                return;
        }

        // Se escolheu uma loja válida
        if (['1', '2', '3', '4', '5', '6'].includes(msg.body)) {
            const chat = await msg.getChat();
            await chat.sendStateTyping();
            await delay(3000);
            await client.sendMessage(msg.from, `👤 Você escolheu a loja ${lojaEscolhida}.\n\n Com qual área você deseja falar? \n\n1 - Comercial\n2 - Financeiro`);

            // Armazenar a loja escolhida no estado do usuário
            userStates[chatId] = { state: 'escolhendo-area', loja: lojaEscolhida };
            return;
        }
    }

    // Se o estado for 'escolhendo-area'
    if (currentState.state === 'escolhendo-area') {
        const chat = await msg.getChat();
        await chat.sendStateTyping();
        await delay(3000);

        const loja = currentState.loja; // Pega a loja que o usuário escolheu

        if (msg.body === '1') {
            // Envia a lista de contatos comerciais da loja escolhida
            await client.sendMessage(msg.from, contatosPorLoja[loja].comercial);
        } else if (msg.body === '2') {
            // Envia os contatos financeiros da loja escolhida
            await client.sendMessage(msg.from, contatosPorLoja[loja].financeiro);
        } else {
            await client.sendMessage(msg.from, '_*Opção inválida*. Por favor, escolha uma opção válida._');
            return;
        }

        // Finaliza a sessão
        await delay(3000);
        await client.sendMessage(msg.from, '_Sessão finalizada. Digite (Menu) para iniciar novamente._');

        // Reseta o estado para o estado inicial
        userStates[chatId] = 'inicio'; 
    }
});
