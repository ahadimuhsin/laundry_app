<table>
    <thead>
        <tr>
            <th colspan="2"><strong>Laporan Transaksi {{ date("F", mktime(0,0,0, $month, 10)) }} - {{ $year }}</strong></th>
        </tr>
        <tr>
            <th colspan="2"></th>
        </tr>
        <tr>
            <th>Tanggal</th>
            <th>Pemasukan</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($transaction as $row)
        <tr>
            <td>{{ date('d F Y', strtotime($row['date'])) }}</td>
            <td>Rp {{ number_format($row['total']) }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
