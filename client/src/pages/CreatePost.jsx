import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRandomPrompt } from '../utils';
import { preview } from '../assets';
import { FormFiled,Loader } from '../components';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form,setForm] = useState({
    name:'',
    prompt:'',
    photo:'',
  });
  const submitHandler = async(e)=>{
    console.log("Submit Handler Clicked");
    e.preventDefault();
    if(form.prompt && form.photo){
      setLoading(true);
      try{
        const res = await fetch('http://localhost:8000/api/v1/posts',{
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form)
        });
        await res.json(); // convert it into json...
        navigate('/');
      }
      catch(error){
        alert(error);
      }
      finally{
        setLoading(false);
      }
    }
    else{
      alert("Please Generate a prompt and photo");
    }
  }
  const changeHandler = (e) =>{
    setForm({...form,[e.target.name]:e.target.value});
  }
  const supriseMeHandler = (e) =>{
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({...form,prompt: randomPrompt});
  }
  const generateImageHandler = async() =>{
    // this function send a request to the backend to connect from the api and get the image.
    // if(form.prompt){
    //   try{
    //     setGeneratingImg(true);
    //     // while we are generating this image..we set the geneargin to the true...
    //     const response = await fetch('http://localhost:8000/api/v1/dalle',{
    //       method: 'POST',
    //       headers:{
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({prompt: form.prompt}),
    //     });
    //     const data = await response.json();
    //     console.log("Here we have some data");
    //     console.log(data);
    //     setForm({...form,photo:`data:image/jpeg;base64,${
    //       data.photo
    //     }`});
    //   }
    //   catch(error){
    //     alert(error);
    //   }
    //   finally{
    //     setGeneratingImg(false);
    //   }
    // }
    // else{
    //   alter('Please Enter a Prompt');
    // }
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('http://localhost:8000/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide proper prompt');
    }
  }
  // while making constact with backend api..
  const [generatingImg,setGeneratingImg] = useState(false);
  const[loading,setLoading] = useState(false);
  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
        <p className = "max-w-[500px] mt-2 text-[16px] text-[#666e75]">Create imaginative and visually stunning images generated by AI ImageGenerator Community</p>
      </div>
      {/** Create post Compoent */}
      <form className= "mt-16 max-w-3xl" onSubmit={submitHandler}>
        <div className='flex flex-col gap-5'>
          <FormFiled 
          labelName = "Your name"
          type = "text"
          name = "name"
          placeholder = "Jonh Doe"
          value = {form.value}
          changeHandler = {changeHandler}
          />
          <FormFiled 
          labelName = "Prompt"
          type = "text"
          name = "prompt"
          placeholder = "A plush toy robot sitting against a yellow wall"
          value = {form.prompt}
          changeHandler = {changeHandler}
          isSuprisseMe
          supriseMeHandler = {supriseMeHandler}
          />
          {/**just showing the image which are getting generated incase Nothing them show the default image.*/}
          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo?(<img src = {form.photo} alt = {form.prompt} className='w-full h-full object-contain'/>):(<img src = {preview} alt = "preview" className='w-9/12 h-9/12 object-contain opacity-40'/>)
            }
          {generatingImg && <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgbs(0,0,0,0.5)] rounded-lg'>
            <Loader />
            </div>}
          </div>
        </div>
        <div className='mt-5 flex gap=5'>
          <button type = "button" onClick={generateImageHandler} className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>{generatingImg?"Generating...":"Generate"}</button>
        </div>
        <div className='mt-10'>
            <p className='mt-2 text-[#666e75] text-[14px]'>Once you have created the image you want, you can shar it with others in the community</p>
            <button
            type = "submit"
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center' onSubmit={submitHandler}
            >Share With Community</button>
        </div>
      </form>
    </section>
  )
}

export default CreatePost;