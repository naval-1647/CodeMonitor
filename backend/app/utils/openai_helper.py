from typing import Optional
from openai import AsyncOpenAI
from app.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def generate_code(prompt: str, language: str = "python") -> str:
    """Generate code based on prompt"""
    system_prompt = f"""You are an expert {language} programmer. Generate clean, well-commented, 
    and production-ready code based on the user's request. Follow best practices and include 
    appropriate error handling."""
    
    response = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2000
    )
    
    return response.choices[0].message.content


async def debug_code(code: str, error_message: Optional[str] = None) -> str:
    """Debug code and suggest fixes"""
    prompt = f"Debug the following code:\n\n```\n{code}\n```"
    if error_message:
        prompt += f"\n\nError message: {error_message}"
    
    system_prompt = """You are an expert debugger. Analyze the code, identify issues, 
    and provide a corrected version with explanations of what was wrong and how you fixed it."""
    
    response = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
        max_tokens=2000
    )
    
    return response.choices[0].message.content


async def explain_code(code: str) -> str:
    """Explain what code does"""
    prompt = f"Explain the following code in detail:\n\n```\n{code}\n```"
    
    system_prompt = """You are an expert programming instructor. Explain the code clearly, 
    covering what it does, how it works, and any important concepts. Make it educational and easy to understand."""
    
    response = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature=0.5,
        max_tokens=2000
    )
    
    return response.choices[0].message.content


async def stream_ai_response(prompt: str, mode: str, code_context: Optional[str] = None):
    """Stream AI response token by token"""
    if mode == "generate":
        system_prompt = """You are an expert programmer. Generate clean, well-commented code 
        based on the user's request."""
        user_prompt = prompt
    elif mode == "debug":
        system_prompt = """You are an expert debugger. Analyze the code and provide fixes."""
        user_prompt = f"Debug this code:\n\n{code_context}\n\nIssue: {prompt}"
    else:  # explain
        system_prompt = """You are a programming instructor. Explain code clearly and educationally."""
        user_prompt = f"Explain this code:\n\n{code_context}\n\nFocus: {prompt}"
    
    stream = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.5,
        max_tokens=2000,
        stream=True
    )
    
    async for chunk in stream:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content
