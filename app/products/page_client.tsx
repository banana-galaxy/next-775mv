'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

function Categories({categories, current, onclick}) {

  //const categories = Array.from(new Set(products.map(product => product['category'])))

  const buttons = categories.map(category => {
    if (current == category) {
      return <button onClick={onclick} id={category} className='interactable w-[110px] pl-3 -ml-[1px] text-left font-bold dark:text-amber border-l-2 hover:bg-gray-100 dark:hover:bg-coolgraydark border-l-gray-500 dark:border-l-amber rounded-r-md'>{category}</button>
    } else {
      return <button onClick={onclick} id={category} className='interactable w-[110px] pl-3 -ml-[1px] text-left dark:text-ochre border-l-2 dark:border-l-ochre hover:bg-gray-100 dark:hover:bg-coolgraydark rounded-r-md'>{category}</button>
    }
  })

  return (
    <div className='fixed w-30 mt-5 flex flex-col items-start'>
      {buttons}
      {/* <button className='w-[110px] text-left pl-3 -ml-[1px] border-l hover:bg-gray-100 border-l-gray-500'>All</button>
      <button className='w-[110px] text-left pl-3 -ml-[1px] border-l hover:bg-gray-100'>Filters</button>
      <button className='w-[110px] text-left pl-3 -ml-[1px] border-l hover:bg-gray-100'>Services</button> */}
    </div>
  )
}

function Product({product = {}, image = ""}: {product: Object, image: String}) {
  const imgClass = "bg-[url('" + product['image'] + "')] relative flex justify-center items-center w-[300px] h-[200px] border-b-2 border-b-lightoutline dark:border-b-ochre rounded-t-[7px] overflow-hidden"
  //console.log(imgClass)
  if (Object.keys(product).length === 0) {
    return (
      <div className='h-[300px] w-[300px] m-3 border rounded-lg shadow-md flex flex-col items-center'>
        <div className='h-[200px] w-[298px] border-b-2 border-b-gray-400 rounded-t-[7px] bg-gray-300'/>
        <div className='w-[100px] h-[25px] mt-4 rounded-md bg-gray-300'/>
        <div className='w-[60px] h-[30px] mt-3 rounded-md flex flex-row overflow-hidden'>
          <div className='text-xl font-semibold text-gray-400'>$</div>
          <div className='ml-1 w-full h-[30px] rounded-md bg-gray-300'/>
        </div>
      </div>
    )
  } else {
    //et image = fs.readdirSync('./public/'+product['sku'])[0]
    return (
      <Link href={"product/"+product['sku']} key={product['_id']} className='interactable group h-[300px] w-[300px] m-3 border border-lightoutline bg-lightaccentbg dark:border-coolgraylight dark:bg-coolgraydark rounded-lg shadow-md dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,1)] hover:shadow-2xl dark:hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,1)] hover:scale-105 transition duration-100 flex flex-col items-center dark:text-white overflow-hidden'>
        <div className="relative flex justify-center items-center w-[300px] h-[200px] border-b-2 border-b-lightoutline dark:border-b-ochre rounded-t-[7px] overflow-hidden">
          <Image src={product['image']} width={300} height={200} alt={product['name']}></Image>
          {/* <div className='w-[300px] h-[200px] group-hover:scale-110 transition'></div> */}
        </div>
        <div className='mt-3 text-xl text-amber text-center group-hover:underline underline-offset-2 decoration-[1.5px]'>{product['name']}</div>
        <div className='mt-3 text-xl font-semibold'>${product['price']}</div>
      </Link>
    )
  }
}

function Products({products}) {

  let image: String = ""
  const spam = products.map(product => {
    return <Product product={product}/>
  })

  return (
    <div className='flex flex-row flex-wrap justify-center'>
      {spam}
    </div>
  )
}

function Loading() {
  return (
    <div className='animate-pulse ml-[200px] flex flex-row flex-wrap'>
      <Product/>
      <Product/>
      <Product/>
    </div>
  )
}

export default function Page({categories, products}: {categories: Array<String>, products: Array<Object>}) {
  const initialProducts = products

  const [category, setCategory] = useState('All')
  const [_products, setProducts] = useState(initialProducts)

  function changeCategory(e) {
    setCategory(e.target.id)
    
    if (e.target.id == "All") {
      setProducts(initialProducts)
    } else {
      setProducts(initialProducts.filter(product => product['category'] == e.target.id))
    }
    //products = products.filter(product => product['category'] == e.target.id)
  }

  return (
    <>
      <Categories categories={categories} current={category} onclick={changeCategory}/>
      <Products products={_products}/>
    </>
  )
}