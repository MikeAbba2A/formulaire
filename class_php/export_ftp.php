<?php
class FtpExporter {
    private $host;
    private $port;
    private $login;
    private $password;
    private $path;
    private $fileContent;
    private $outputFilename;

    public function __construct($host, $port, $login, $password, $path, $fileContent, $outputFilename) {
        $this->host = $host;
        $this->port = $port;
        $this->login = $login;
        $this->password = $password;
        $this->path = $path;
        $this->fileContent = $fileContent;
        $this->outputFilename = $outputFilename;
    }

    public function send() {
        $exportFinished = false;
        $ftpConnect = ftp_ssl_connect($this->host, $this->port, 20); // Utilisation de ftp_ssl_connect pour une connexion sécurisée
        if($ftpConnect) {
            $loginResult = ftp_login($ftpConnect, $this->login, $this->password);
            if (!$loginResult) {
                ftp_close($ftpConnect);
            } else {
                ftp_pasv($ftpConnect, true);

                $filePath = "$this->path/$this->outputFilename";
                $localFilePath = Tmp_Dir() . "/" . $this->outputFilename;

                $outputFile = fopen($localFilePath, 'w');
                fputs($outputFile, $this->fileContent);
                fclose($outputFile);

                $uploadResult = ftp_put($ftpConnect, $filePath, $localFilePath, FTP_ASCII);
                if($uploadResult){
                    $exportFinished = true;
                }
            }
        }

        return $exportFinished;
    }
}
?>
