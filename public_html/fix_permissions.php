<?php
header('Content-Type: text/plain');

echo "=== FIXING FILE & FOLDER PERMISSIONS ===\n\n";

function fixPerms($dir) {
    if (!is_dir($dir)) return;
    
    $items = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );
    
    $fixed_dirs = 0;
    $fixed_files = 0;
    
    foreach ($items as $item) {
        if ($item->isDir()) {
            chmod($item->getRealPath(), 0755);
            $fixed_dirs++;
        } else {
            chmod($item->getRealPath(), 0644);
            $fixed_files++;
        }
    }
    
    // Also fix root dir itself
    chmod($dir, 0755);
    
    echo "Directory: $dir\n";
    echo " - Fixed folders: $fixed_dirs (set to 755)\n";
    echo " - Fixed files: $fixed_files (set to 644)\n\n";
}

fixPerms(__DIR__);

// If parent api-v2 exists
$apiDir = dirname(__DIR__) . '/api-v2.zidansport.org';
if (is_dir($apiDir)) {
    fixPerms($apiDir);
}

echo "SUCCESS! Semua file dan folder sekarang berizin 644 / 755.\n";
echo "Silakan refresh kembali https://zidansport.org/ di browser Anda.\n";
