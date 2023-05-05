import getSections from '@ecomplus/storefront-template/template/js/netlify-cms/base-config/sections'
import getSettings from '@ecomplus/storefront-template/template/js/netlify-cms/base-config/collections/settings'
import getLayout from '@ecomplus/storefront-template/template/js/netlify-cms/base-config/collections/layout'
import getPages from '@ecomplus/storefront-template/template/js/netlify-cms/base-config/collections/pages'
import getBlogPosts from '@ecomplus/storefront-template/template/js/netlify-cms/base-config/collections/blog-posts'
import getExtraPages from '@ecomplus/storefront-template/template/js/netlify-cms/base-config/collections/extra-pages'
import getWidgets from '@ecomplus/storefront-template/template/js/netlify-cms/base-config/collections/widgets'

//ALPIX CUSTOM MODULES
//import getReceitas from './collections/receitas-posts'
//import getGrids from './collections/grids'
//import getMenuConfig from './collections/menu-config'
const animations = [
  "backInDown",
  "backInLeft",
  "backInRight",
  "backInUp",
  "bounceIn",
  "bounceInDown",
  "bounceInLeft",
  "bounceInRight",
  "bounceInUp",
  "fadeIn",
  "fadeInDown",
  "fadeInDownBig",
  "fadeInLeft",
  "fadeInLeftBig",
  "fadeInRight",
  "fadeInRightBig",
  "fadeInUp",
  "fadeInUpBig",
  "fadeInTopLeft",
  "fadeInTopRight",
  "fadeInBottomLeft",
  "fadeInBottomRight",
  "lightSpeedInRight",
  "lightSpeedInLeft",
  "lightSpeedOutRight",
  "lightSpeedOutLeft",
  "rotateIn",
  "rotateInDownLeft",
  "rotateInDownRight",
  "rotateInUpLeft",
  "rotateInUpRight",
  "zoomIn",
  "zoomInDown",
  "zoomInLeft",
  "zoomInRight",
  "zoomInUp",
  "slideInDown",
  "slideInLeft",
  "slideInRight",
  "slideInUp"
]

const bannerFields = [
  {
    label: 'Imagem',
    name: 'img',
    widget: 'image'
  },
  {
    label: 'Link',
    required: false,
    name: 'link',
    widget: 'string'
  },
  {
    label: 'Alt',
    required: false,
    name: 'alt',
    widget: 'string'
  },
  {
    label: 'Imagem para mobile',
    required: false,
    name: 'mobile_img',
    widget: 'image'
  },
  {
    label: 'Título',
    required: false,
    name: 'title',
    widget: 'string'
  },
  {
    label: 'Cor do título',
    required: false,
    name: 'title_color',
    widget: 'color'
  },
  {
    label: 'Descrição',
    required: false,
    name: 'description',
    widget: 'string'
  },
  {
    label: 'Cor da descrição',
    required: false,
    name: 'description_color',
    widget: 'color'
  },
  {
    label: 'Texto do botão',
    required: false,
    name: 'btn_text',
    widget: 'string'
  },
  {
    label: 'Cor do texto do botão',
    required: false,
    name: 'btn_text_color',
    widget: 'color'
  },
  {
    label: 'Fundo do botão',
    required: false,
    name: 'btn_background',
    widget: 'color'
  },
  {
    label: 'Cor da Máscara',
    required: false,
    name: 'mask_color',
    widget: 'color'
  },
  {
    label: 'Transparência da Máscara',
    name: 'mask_opacity',
    hint: 'De 0 até 10. 0 é transparente e 10 é totalmente opaco.',
    min: 0,
    max:10,
    default:5,    
    widget: 'number'
  },
  {
    label: 'Posição do conteúdo',
    required: true,
    name: 'content_position',
    widget: 'select',
    options: ["top_left","top_center","top_right","center_left","center_center","center_right","bottom_left","bottom_center","bottom_right"]
  },
  {
    label: 'Ordem de conteúdo',
    required: true,
    name: 'content_order',
    widget: 'select',
    options: ["before_image","inside_image","after_image"]
  },  
  {
    label: 'Animação',
    required: false,
    name: 'animate',
    widget: 'select',
    options: animations
  },
]


export default options => {
  options.sections = getSections(options).concat([
    {
      label: '[ALPIX] - Banner responsivo',
      name: 'apx_responsive-banner',
      widget: 'object',
      fields: bannerFields
    },
    {
      label: '[ALPIX] - Grid de banners',
      name: 'apx_banners-grid',
      widget: 'object',
      fields: [
        {
          label: 'Container',
          required: true,
          name: 'container',
          widget: 'select',
          options: ["container","container-fluid","container_90"]
        },  
        {
          label: 'Espaçamento',
          required: true,
          name: 'padding',
          widget: 'select',
          options: ["px-0","px-1","px-2","px-3","px-4","px-5"]
        },  
        {
          label: 'Banners',
          name: 'banners',
          widget: 'list',
          fields: bannerFields
        }
      ]
    },
    {
      label: '[ALPIX] - Slider de banners',
      name: 'apx_banner-slider',
      widget: 'object',
      fields: [
        {
          label: 'Slides',
          name: 'slides',
          widget: 'list',
          fields: bannerFields.concat([
            {
              label: 'Data de início',
              required: false,
              name: 'start',
              widget: 'datetime',
              dateFormat: 'DD/MM/YYYY',
              timeFormat: 'HH:mm'
            },
            {
              label: 'Data de encerramento',
              required: false,
              name: 'end',
              widget: 'datetime',
              dateFormat: 'DD/MM/YYYY',
              timeFormat: 'HH:mm'
            }
          ])
        },
        {
          label: 'Slider autoplay',
          name: 'autoplay',
          hint: 'Exibição de cada slide em milisegundos, defina 0 para desabilitar autoplay',
          min: 0,
          step: 1000,
          default: 9000,
          widget: 'number'
        }
      ]
    },
    {
      label: '[ALPIX] - Depoimentos',
      name: 'apx_testimonials',
      widget: 'object',
      fields: [
        {
          label: 'Título',
          required: false,
          name: 'title',
          widget: 'string'
        },
        {
          label: 'Descrição',
          required: false,
          name: 'description',
          widget: 'text'
        },
        {
          label: 'Depoimentos',
          name: 'testimonials',
          widget: 'list',
          required:false,
          fields: [
            {
              label: 'Depoimento',
              name: 'testimonial',
              widget: 'object',
              required:false,
              fields: [
                {
                  label: 'Nome do Cliente',
                  name: 'name',
                  widget: 'string'          
                },
                {
                  label: 'Depoimento',
                  name: 'text',
                  widget: 'string'          
                },
                {
                  label: 'Foto do Cliente',
                  name: 'image',
                  widget: 'image'          
                },                
              ]
            },          
          ]
        },        
      ]
    },
    {
      label: '[ALPIX] - FAQ',
      name: 'apx_faq',
      widget: 'object',
      fields: [
        {
          label: 'Título',
          required: false,
          name: 'title',
          widget: 'string'
        },
        {
          label: 'Descrição',
          required: false,
          name: 'description',
          widget: 'text'
        },
        {
          label: 'Posição da descrição',
          required: false,
          name: 'list',
          widget: 'select',
          options: ["description_first","description_last"]
        },        
        {
          label: 'Perguntas',
          name: 'questions',
          widget: 'list',
          required:false,
          fields: [
            {
              label: 'Pergunta',
              name: 'question',
              widget: 'object',
              required:false,
              fields: [
                {
                  label: 'Pergunta',
                  name: 'title',
                  widget: 'string'          
                },
                {
                  label: 'Resposta',
                  name: 'response',
                  widget: 'string'          
                }              
              ]
            },          
          ]
        },        
      ]
    },
    {
      label: '[ALPIX] - Newsletter',
      name: 'apx_newsletter',
      widget: 'object',
      fields: [
        {
          label: 'Título',
          required: false,
          name: 'title',
          widget: 'string'
        },
        {
          label: 'Descrição',
          required: false,
          name: 'description',
          widget: 'text'
        },
        {
          label: 'Posição da descrição',
          required: false,
          name: 'list',
          widget: 'select',
          options: ["description_first","description_last"]
        },        
        {
          label: 'Texto do botão',
          required: false,
          name: 'btn_text',
          widget: 'text'
        },  
        {
          label: 'Placeholder do campo',
          required: false,
          name: 'input_placeholder',
          widget: 'text'
        }  
      ]
    },
    {
      label: '[ALPIX] - Lista de Produtos',
      name: 'apx_productList_A',
      widget: 'object',
      fields: [
        {
          label: 'Produtos',
          name: 'products',
          widget: 'list',
          field: {
            label: 'SKU do produto',
            name: 'product_id',
            widget: 'select',
            options: options.state.routes
              .filter(({ sku }) => typeof sku === 'string')
              .map(({ _id, sku }) => ({
                label: sku,
                value: _id
              }))
          }
        },
        {
          label: 'Título',
          required: false,
          name: 'title',
          widget: 'string'
        },
        {
          label: 'Descrição',
          required: false,
          name: 'description',
          widget: 'text'
        },
        {
          label: 'Posição da descrição',
          required: false,
          name: 'list',
          widget: 'select',
          options: ["description_first","description_last"]
        },
        {
          label: 'Produtos por linha no mobile',
          required: true,
          name: 'num_col_sm',
          widget: 'select',
          options: ["1","2"]
        },
        {
          label: 'Container',
          required: true,
          name: 'container',
          widget: 'select',
          options: ["container","container-fluid","container_90"]
        },  
        {
          label: 'Espaçamento',
          required: true,
          name: 'padding',
          widget: 'select',
          options: ["px-md-0","px-md-1","px-md-2","px-md-3","px-md-4","px-md-5"]
        },  
        {
          label: 'Espaçamento Mobile',
          required: true,
          name: 'padding_sm',
          widget: 'select',
          options: ["px-0","px-1","px-2","px-3","px-4","px-5"]
        },          
        {
          label: 'Carrossel Mobile?',
          required: true,
          name: 'carrossel_sm',
          widget: 'select',
          options: ["Sim","Não"]
        },        
        {
          label: 'Produtos por linha no desktop',
          required: true,
          name: 'num_col_md',
          widget: 'select',
          options: ["2","3","4","5"]
        },
        {
          label: 'Carrossel Desktop?',
          required: true,
          name: 'carrossel_md',
          widget: 'select',
          options: ["Sim","Não"]
        },
        {
          label: 'Exibir dots do carrossel desktop?',
          required: true,
          name: 'carrossel_dots_md',
          widget: 'select',
          options: ["Sim","Não"]
        },
        {
          label: 'Exibir dots do carrossel mobile?',
          required: true,
          name: 'carrossel_dots_sm',
          widget: 'select',
          options: ["Sim","Não"]
        },
        {
          label: 'Exibir setas do carrossel desktop?',
          required: true,
          name: 'carrossel_arrows_md',
          widget: 'select',
          options: ["Sim","Não"]
        },
        {
          label: 'Exibir setas do carrossel mobile?',
          required: true,
          name: 'carrossel_arrows_sm',
          widget: 'select',
          options: ["Sim","Não"]
        },
        {
          label: 'Texto do Botão',
          required: false,
          name: 'btn_text',
          widget: 'string'
        },
        {
          label: 'Link do Botão',
          required: false,
          name: 'btn_link',
          widget: 'string'
        }
      ]
    },
    {
      label: '[ALPIX] - HTML por Categoria (Apenas para Produto)',
      name: 'apx_blockPerCategory',
      widget: 'object',
      fields: [
        {
          label: 'Título (Apenas identificação)',
          required: false,
          name: 'title',
          widget: 'string'
        },
        {
          label: 'Gatilho - Nome da Categoria (Case Sensisitive)',
          required: false,
          name: 'slug',
          widget: 'string'
        },
        {
          label: 'Lista de Conteúdo',
          name: 'list',
          widget: 'list',
          required:false,
          fields: [
            {
              label: 'Conteúdo',
              name: 'content',
              widget: 'object',
              required:false,
              fields: [
                {
                  label: 'Título',
                  name: 'title',
                  widget: 'string',
                  required:false,
                },
                {
                  label: 'Subtítulo',
                  name: 'subtitle',
                  widget: 'string',
                  required:false,          
                },
                {
                  label: 'Posicionamento da Imagem',
                  name:"image_position",
                  widget: 'select',
                  options: ["first","last"]        
                },
                {
                  label: 'Alinhamento do Texto',
                  widget: 'select',
                  name:"text_align",
                  options: ["left","right","justify","center"]        
                },
                {
                  label: 'Texto',
                  name: 'body',
                  widget: 'markdown'          
                },
                {
                  label: 'Imagem',
                  name: 'image',
                  widget: 'image',
                  required:false,          
                },                
              ]
            },          
          ]
        },        
      ]
    },
    {
      label: '[ALPIX] - Feed Instagram',
      name: 'apx_instafeed',
      widget: 'object',
      fields: [
        {
          label: 'Título',
          required: false,
          name: 'title',
          widget: 'string'
        },
        {
          label: 'Sub Título',
          required: false,
          name: 'subtitle',
          widget: 'string'
        },
        {
          label: 'Descrição',
          required: false,
          name: 'description',
          widget: 'text'
        },
        {
          label: 'Link p/ Chaves do Instagram',
          required: false,
          name: 'instantTokens',
          widget: 'string'
        },
        {
          label: 'Quantidade de Fotos (Desktop)',
          required: false,
          name: 'quantity_desktop',
          widget: 'select',
          options : ["3","4","5","6","7","8","9","10","11","12"]
        },
        {
          label: 'Quantidade de Fotos (Mobile)',
          required: false,
          name: 'quantity_mobile',
          widget: 'select',
          options : ["3","4","5","6","7","8","9","10","11","12"]
        },
        {
          label: 'Grid de Fotos (Desktop)',
          required: false,
          name: 'grid_desktop',
          widget: 'select',
          options : ["3","4","5","6","7","8","9","10","11","12"]
        },
        {
          label: 'Grid de Fotos (Mobile)',
          required: false,
          name: 'grid_mobile',
          widget: 'select',
          options : ["3","4","5","6","7","8","9","10","11","12"]
        }
      ]
    }

])

  return {
    backend: {
      name: 'git-gateway',
      branch: 'master',
      commit_messages: {
        create: 'Create {{collection}} “{{slug}}”',
        update: 'Update {{collection}} “{{slug}}”',
        delete: 'Delete {{collection}} “{{slug}}”',
        uploadMedia: 'Upload “{{path}}”',
        deleteMedia: '[skip ci] Delete “{{path}}”',
        openAuthoring: '{{message}}'
      }
    },
    logo_url: 'https://ecom.nyc3.digitaloceanspaces.com/storefront/cms.png',
    locale: 'pt',
    load_config_file: Boolean(window.CMS_LOAD_CONFIG_FILE),
    media_folder: `${options.baseDir}template/public/img/uploads`,
    public_folder: '/img/uploads',
    slug: {
      encoding: 'ascii',
      clean_accents: true,
      sanitize_replacement: '-'
    },
    collections: [
      getSettings(options),
      getLayout(options),
      getPages(options),
      getBlogPosts(options),
      //getReceitas(options),
      //getGrids(options),
      //getMenuConfig(options),
      getExtraPages(options),
      getWidgets(options)
    ]
  }
}
