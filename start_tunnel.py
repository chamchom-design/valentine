from pyngrok import ngrok

if __name__ == '__main__':
    tunnel = ngrok.connect(8000, "http")
    print("PUBLIC_URL:", tunnel.public_url)
    print("(Press Ctrl+C to stop the tunnel)")
    try:
        ngrok_process = ngrok.get_ngrok_process()
        ngrok_process.proc.wait()
    except KeyboardInterrupt:
        print('\nStopping tunnel...')
        ngrok.kill()
